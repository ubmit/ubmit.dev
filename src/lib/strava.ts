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
export function mapSportType(type: StravaSportType): SportCategory | null {
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
 * Generate mock activities for the last 6 months
 */
export function getMockActivities(): DayActivity[] {
  const activities: Map<string, DayActivity> = new Map();
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  // Seed random with consistent value for reproducibility
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Generate activities over the past 6 months
  const currentDate = new Date(sixMonthsAgo);
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];

    // 60% chance of being an active day
    if (random() < 0.6) {
      const activity: DayActivity = { date: dateStr };

      // Swim: 30% chance on active days
      if (random() < 0.3) {
        activity.swim = Math.floor(1000 + random() * 2500); // 1000-3500m
      }

      // Run: 50% chance on active days
      if (random() < 0.5) {
        activity.run = Math.round((5 + random() * 16) * 10) / 10; // 5-21km
      }

      // Ride: 40% chance on active days
      if (random() < 0.4) {
        activity.ride = Math.round((20 + random() * 80) * 10) / 10; // 20-100km
      }

      // Only add if at least one activity exists
      if (activity.swim || activity.run || activity.ride) {
        activities.set(dateStr, activity);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in empty days to ensure continuous timeline
  return fillEmptyDays(activities, sixMonthsAgo, today);
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
export function transformStravaActivities(
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
      dayActivity.swim = (dayActivity.swim || 0) + activity.distance;
    } else if (category === "run") {
      dayActivity.run = (dayActivity.run || 0) + activity.distance / 1000;
    } else if (category === "ride") {
      dayActivity.ride = (dayActivity.ride || 0) + activity.distance / 1000;
    }
  }

  // Fill in empty days for continuous timeline
  return fillEmptyDays(dayMap, startDate, endDate);
}

/**
 * Main export: Get activities (real API or mock data)
 */
export async function getActivities(): Promise<DayActivity[]> {
  const hasStravaCredentials =
    import.meta.env.STRAVA_REFRESH_TOKEN &&
    import.meta.env.STRAVA_CLIENT_ID &&
    import.meta.env.STRAVA_CLIENT_SECRET;

  if (!hasStravaCredentials) {
    console.log("No Strava credentials, using mock data");
    return getMockActivities();
  }

  try {
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

    console.log(`Fetched ${stravaActivities.length} activities from Strava`);

    return transformStravaActivities(stravaActivities, sixMonthsAgo, today);
  } catch (error) {
    console.warn("Failed to fetch Strava activities, using mock data:", error);
    return getMockActivities();
  }
}
