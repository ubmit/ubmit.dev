import type { DayActivity, SportCategory } from "../../types/strava";
import { formatDistance } from "./formatDistance";
import { RidingIcon } from "./RidingIcon";
import { RunningIcon } from "./RunningIcon";
import { SwimmingIcon } from "./SwimmingIcon";

type Props = {
  activities: DayActivity[];
};

function getTotalDistance(activities: DayActivity[], sport: SportCategory) {
  return activities.reduce((sum, day) => sum + (day[sport] ?? 0), 0);
}

export function SummaryStats({ activities }: Props) {
  const totalSwim = getTotalDistance(activities, "swim");
  const totalRun = getTotalDistance(activities, "run");
  const totalRide = getTotalDistance(activities, "ride");

  const activeDays = activities.filter(
    (day) => Boolean(day.swim) || Boolean(day.run) || Boolean(day.ride),
  ).length;

  return (
    <div className="flex justify-between pb-6 font-mono text-sm">
      <span>{activeDays} days</span>
      <div className="text-gray-1100 flex gap-6 text-sm">
        <div className="flex items-center gap-1">
          <SwimmingIcon className="size-4" />
          {formatDistance(totalSwim, "m")}m{" "}
        </div>
        <div className="flex items-center gap-1">
          <RidingIcon className="size-4" />
          {formatDistance(totalRide, "km")}km{" "}
        </div>
        <div className="flex items-center gap-1">
          <RunningIcon className="size-4" />
          {formatDistance(totalRun, "km")}km{" "}
        </div>
      </div>
    </div>
  );
}
