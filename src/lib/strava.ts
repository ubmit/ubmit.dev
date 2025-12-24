import type {
  DayActivity,
  SportCategory,
  StravaActivity,
  StravaSportType,
} from "../types/strava";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";

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
  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: import.meta.env.STRAVA_CLIENT_ID,
      client_secret: import.meta.env.STRAVA_CLIENT_SECRET,
      refresh_token: import.meta.env.STRAVA_REFRESH_TOKEN,
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
  const perPage = 100;

  while (true) {
    const url = new URL(`${STRAVA_API_BASE}/athlete/activities`);
    url.searchParams.set("after", after.toString());
    url.searchParams.set("page", page.toString());
    url.searchParams.set("per_page", perPage.toString());

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

    if (activities.length < perPage) break;
    page++;
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

  // Fetch last 6 months of activities
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  const afterTimestamp = Math.floor(sixMonthsAgo.getTime() / 1000);

  const stravaActivities = await fetchStravaActivities(
    accessToken,
    afterTimestamp,
  );

  return transformStravaActivities(stravaActivities, sixMonthsAgo, today);
}
