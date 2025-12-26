import { z } from "astro/zod";
import type {
  DayActivity,
  SportCategory,
  StravaActivity,
  StravaSportType,
} from "../types/strava";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const MONTHS_TO_FETCH = 12;
const STRAVA_PAGE_SIZE = 100;
const RATE_LIMIT_DELAY_MS = 100;

const envSchema = z.object({
  STRAVA_CLIENT_ID: z.string().min(1, "STRAVA_CLIENT_ID is required"),
  STRAVA_CLIENT_SECRET: z.string().min(1, "STRAVA_CLIENT_SECRET is required"),
  STRAVA_REFRESH_TOKEN: z.string().min(1, "STRAVA_REFRESH_TOKEN is required"),
});

/**
 * Map Strava sport types to our simplified categories
 */
function mapSportType(type: StravaSportType): SportCategory | null {
  const sportMap: Partial<Record<StravaSportType, SportCategory>> = {
    Swim: "swim",
    Run: "run",
    TrailRun: "run",
    Treadmill: "run",
    VirtualRun: "run",
    Ride: "ride",
    MountainBikeRide: "ride",
    VirtualRide: "ride",
    GravelRide: "ride",
  };

  return sportMap[type] ?? null;
}

/**
 * Fill gaps in activity data to ensure continuous timeline
 */
function fillEmptyDays(
  activities: Map<string, DayActivity>,
  startDate: Date,
  endDate: Date,
): DayActivity[] {
  const allDays: DayActivity[] = [];
  const fillDate = new Date(startDate);

  while (fillDate <= endDate) {
    const dateStr = fillDate.toISOString().split("T")[0];
    allDays.push(activities.get(dateStr) || { date: dateStr });
    fillDate.setDate(fillDate.getDate() + 1);
  }

  return allDays;
}

/**
 * Get a new access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const env = envSchema.parse({
    STRAVA_CLIENT_ID: import.meta.env.STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET: import.meta.env.STRAVA_CLIENT_SECRET,
    STRAVA_REFRESH_TOKEN: import.meta.env.STRAVA_REFRESH_TOKEN,
  });

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      refresh_token: env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Fetch activities from Strava API
 */
async function fetchStravaActivities(
  accessToken: string,
  after: number,
): Promise<StravaActivity[]> {
  const allActivities: StravaActivity[] = [];
  let page = 1;

  while (true) {
    const url = new URL(`${STRAVA_API_BASE}/athlete/activities`);
    url.searchParams.set("after", after.toString());
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", STRAVA_PAGE_SIZE.toString());

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Strava API error: ${response.status} ${error}`);
    }

    const activities: StravaActivity[] = await response.json();

    if (activities.length === 0) break;

    allActivities.push(...activities);

    if (activities.length < STRAVA_PAGE_SIZE) break;

    page++;
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
  }

  return allActivities;
}

/**
 * Transform Strava activities to DayActivity format
 */
function transformStravaActivities(
  activities: StravaActivity[],
  startDate: Date,
  endDate: Date,
): DayActivity[] {
  const dayMap = new Map<string, DayActivity>();

  for (const activity of activities) {
    const date = activity.start_date.split("T")[0];
    const category = mapSportType(activity.sport_type);

    // Skip unsupported activity types
    if (!category) continue;

    if (!dayMap.has(date)) {
      dayMap.set(date, { date });
    }

    const dayActivity = dayMap.get(date)!;

    // Accumulate distances for same day, same sport
    if (category === "swim") {
      dayActivity.swim = (dayActivity.swim ?? 0) + activity.distance;
    } else if (category === "run") {
      dayActivity.run = (dayActivity.run ?? 0) + activity.distance / 1000;
    } else if (category === "ride") {
      dayActivity.ride = (dayActivity.ride ?? 0) + activity.distance / 1000;
    }
  }

  // Fill in empty days for continuous timeline
  return fillEmptyDays(dayMap, startDate, endDate);
}

/**
 * Main export: Get activities from Strava API
 */
export async function getActivities(): Promise<DayActivity[]> {
  const accessToken = await refreshAccessToken();

  // Fetch last N months of activities
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight
  const startDate = new Date(today);
  startDate.setDate(1); // Set to first of month
  startDate.setMonth(today.getMonth() - MONTHS_TO_FETCH);
  const afterTimestamp = Math.floor(startDate.getTime() / 1000);

  const stravaActivities = await fetchStravaActivities(
    accessToken,
    afterTimestamp,
  );

  return transformStravaActivities(stravaActivities, startDate, today);
}
