import type { DayActivity } from "../../types/strava";

export function getMaxActivityDistance(activities: DayActivity[]) {
  return Math.max(
    ...activities.map(
      (day) => (day.swim ?? 0) / 1000 + (day.run ?? 0) + (day.ride ?? 0),
    ),
    1,
  );
}
