import { Tooltip } from "@base-ui/react/tooltip";

import { RidingIcon } from "./RidingIcon";
import { RunningIcon } from "./RunningIcon";
import { SwimmingIcon } from "./SwimmingIcon";
import type { DayActivity } from "../../types/strava";

import { formatDate } from "./formatDate";
import { formatDistance } from "./formatDistance";
import { getMaxActivityDistance } from "./getMaxActivityDistance";

type Props = {
  activities: DayActivity[];
};

// 200px max bar height
const MAX_BAR_HEIGHT = 200;

export function BarGraph({ activities }: Props) {
  const maxActivityDistance = getMaxActivityDistance(activities);

  return (
    <Tooltip.Provider delay={0} closeDelay={0}>
      <div className="scrollbar-hide overflow-x-auto">
        <div className="flex h-50 items-end gap-1">
          {activities.map((day) => {
            const swimDistance = (day.swim ?? 0) / 1000;
            const runDistance = day.run ?? 0;
            const rideDistance = day.ride ?? 0;
            const totalDistance = swimDistance + runDistance + rideDistance;
            const barHeight = Math.round(
              (totalDistance / maxActivityDistance) * MAX_BAR_HEIGHT,
            );

            const hasActivity = Boolean(day.swim || day.run || day.ride);

            return (
              <Tooltip.Root key={day.date}>
                <Tooltip.Trigger
                  render={<div />}
                  aria-label={
                    hasActivity
                      ? `Activity for ${formatDate(day.date)}`
                      : "Rest day"
                  }
                >
                  {hasActivity ? (
                    <div
                      className="hover:bg-gray-1100 w-1 rounded-t-sm bg-gray-900"
                      style={{ height: `${barHeight}px` }}
                    />
                  ) : (
                    <div className="h-50 w-1 bg-transparent" />
                  )}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Positioner side="bottom" sideOffset={8}>
                    <Tooltip.Popup className="rounded-md border border-gray-600 bg-gray-100 p-3 font-mono text-xs whitespace-nowrap shadow-lg">
                      <div className="text-gray-1200 mb-2">
                        {formatDate(day.date)}
                      </div>
                      {hasActivity ? (
                        <ul className="space-y-2 text-gray-900">
                          {day.swim && (
                            <li className="flex items-center gap-1">
                              <SwimmingIcon className="size-4" />
                              {formatDistance(day.swim, "m")}m
                            </li>
                          )}
                          {day.ride && (
                            <li className="flex items-center gap-1">
                              <RidingIcon className="size-4" />
                              {formatDistance(day.ride, "km")}km
                            </li>
                          )}
                          {day.run && (
                            <li className="flex items-center gap-1">
                              <RunningIcon className="size-4" />
                              {formatDistance(day.run, "km")}km
                            </li>
                          )}
                        </ul>
                      ) : (
                        <div className="text-gray-900">Rest day</div>
                      )}
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </div>
      </div>
    </Tooltip.Provider>
  );
}
