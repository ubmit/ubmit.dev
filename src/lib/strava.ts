import type {
  DayActivity,
  SportCategory,
  StravaActivity,
  StravaSportType,
} from "../types/strava";

/**
 * Map Strava sport types to our simplified categories
 */
export function mapSportType(type: StravaSportType): SportCategory {
  const sportMap: Record<StravaSportType, SportCategory> = {
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
  return sportMap[type];
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
  const allDays: DayActivity[] = [];
  const fillDate = new Date(sixMonthsAgo);
  while (fillDate <= today) {
    const dateStr = fillDate.toISOString().split("T")[0];
    allDays.push(activities.get(dateStr) || { date: dateStr });
    fillDate.setDate(fillDate.getDate() + 1);
  }

  return allDays;
}

/**
 * Fetch activities from Strava API (future implementation)
 */
export async function fetchStravaActivities(): Promise<StravaActivity[]> {
  // TODO: Implement when Strava API credentials are available
  // 1. Check if refresh token needs renewal
  // 2. Fetch activities from /athlete/activities
  // 3. Return normalized data
  throw new Error("Strava API integration not yet implemented");
}

/**
 * Transform Strava activities to DayActivity format
 */
export function transformStravaActivities(
  activities: StravaActivity[],
): DayActivity[] {
  const dayMap = new Map<string, DayActivity>();

  for (const activity of activities) {
    const date = activity.start_date.split("T")[0];
    const category = mapSportType(activity.sport_type);

    if (!dayMap.has(date)) {
      dayMap.set(date, { date });
    }

    const dayActivity = dayMap.get(date)!;

    // Accumulate distances for same day, same sport
    if (category === "swim") {
      dayActivity.swim = (dayActivity.swim || 0) + activity.distance;
    } else if (category === "run") {
      dayActivity.run = (dayActivity.run || 0) + activity.distance / 1000; // Convert to km
    } else if (category === "ride") {
      dayActivity.ride = (dayActivity.ride || 0) + activity.distance / 1000; // Convert to km
    }
  }

  return Array.from(dayMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/**
 * Main export: Get activities (uses mock data for now)
 */
export async function getActivities(): Promise<DayActivity[]> {
  // Check if Strava credentials are available
  const hasStravaCredentials =
    import.meta.env.STRAVA_REFRESH_TOKEN &&
    import.meta.env.STRAVA_CLIENT_ID &&
    import.meta.env.STRAVA_CLIENT_SECRET;

  if (hasStravaCredentials) {
    try {
      const stravaActivities = await fetchStravaActivities();
      return transformStravaActivities(stravaActivities);
    } catch (error) {
      console.warn(
        "Failed to fetch Strava activities, using mock data:",
        error,
      );
      return getMockActivities();
    }
  }

  return getMockActivities();
}
