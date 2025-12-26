import type { DayActivity } from "../../types/strava";
import { SummaryStats } from "./SummaryStats";
import { BarGraph } from "./BarGraph";

type Props = {
  activities: DayActivity[];
};

export function ActivityGraph({ activities }: Props) {
  return (
    <section>
      <SummaryStats activities={activities} />
      <BarGraph activities={activities} />
    </section>
  );
}
