// Strava API response types
export type StravaSportType =
  | "Swim"
  | "Run"
  | "TrailRun"
  | "Treadmill"
  | "VirtualRun"
  | "Ride"
  | "MountainBikeRide"
  | "VirtualRide"
  | "GravelRide";

export type StravaActivity = {
  id: number;
  sport_type: StravaSportType;
  distance: number; // meters
  start_date: string; // ISO 8601
};

// Internal models
export type SportCategory = "swim" | "run" | "ride";

export type DayActivity = {
  date: string; // YYYY-MM-DD
  swim?: number; // meters
  run?: number; // kilometers
  ride?: number; // kilometers
};
