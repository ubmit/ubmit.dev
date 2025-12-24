import { Tooltip } from "@base-ui/react/tooltip";
import type { DayActivity } from "../../types/strava";
import { SwimmingIcon } from "./SwimmingIcon";
import { RunningIcon } from "./RunningIcon";
import { RidingIcon } from "./RidingIcon";
import { SummaryStats } from "./SummaryStats";

import { formatDistance } from "./formatDistance";
import { formatDate } from "./formatDate";

type Props = {
  activities: DayActivity[];
};

export function ActivityGraph({ activities }: Props) {
  // Calculate max height for normalization (convert swim to km for comparison)
  const maxHeight = Math.max(
    ...activities.map(
      (day) => (day.swim ?? 0) / 1000 + (day.run ?? 0) + (day.ride ?? 0),
    ),
    1,
  );

  return (
    <section>
      <SummaryStats activities={activities} />
      {/* Activity Graph */}
      <Tooltip.Provider delay={0} closeDelay={0}>
        <div className="relative">
          <div className="scrollbar-hide overflow-x-auto pb-4">
            <div className="relative flex h-50 min-w-fit items-end gap-0.5">
              {activities.map((day) => {
                const swimKm = (day.swim || 0) / 1000;
                const runKm = day.run || 0;
                const rideKm = day.ride || 0;

                // Calculate heights as pixels (200px max height)
                const swimPx = (swimKm / maxHeight) * 200;
                const runPx = (runKm / maxHeight) * 200;
                const ridePx = (rideKm / maxHeight) * 200;

                const hasActivity =
                  Boolean(day.swim) || Boolean(day.run) || Boolean(day.ride);

                return (
                  <Tooltip.Root key={day.date}>
                    <Tooltip.Trigger
                      className="group relative flex h-50 flex-col justify-end"
                      render={<div />}
                    >
                      {hasActivity ? (
                        <div className="flex w-1 flex-col overflow-hidden rounded-t-sm group-hover:opacity-70">
                          {day.run && (
                            <div
                              className="w-full bg-gray-700"
                              style={{ height: `${runPx}px` }}
                            />
                          )}
                          {day.ride && (
                            <div
                              className="w-full bg-gray-900"
                              style={{ height: `${ridePx}px` }}
                            />
                          )}
                          {day.swim && (
                            <div
                              className="bg-gray-1100 w-full"
                              style={{ height: `${swimPx}px` }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="h-4 w-full bg-gray-400" />
                      )}
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Positioner side="bottom" sideOffset={8}>
                        <Tooltip.Popup className="rounded-md border border-gray-600 bg-gray-100 p-3 font-mono text-xs whitespace-nowrap shadow-lg">
                          <div className="text-gray-1200 mb-2">
                            {formatDate(day.date)}
                          </div>
                          {hasActivity ? (
                            <ul className="text-gray-1100 space-y-2">
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
                            <div className="font-mono text-sm text-gray-900">
                              Rest day
                            </div>
                          )}
                        </Tooltip.Popup>
                      </Tooltip.Positioner>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              })}
            </div>
          </div>
        </div>
      </Tooltip.Provider>
    </section>
  );
}

export default ActivityGraph;
