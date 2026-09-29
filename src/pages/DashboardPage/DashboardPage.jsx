import { useState } from "react";
import dayjs from "dayjs";
import Stats from "../../component/DashboardPage/Stats";
import Graph from "../../component/DashboardPage/Graph";
import RecentJoin from "../../component/DashboardPage/RecentJoin";
import { useGetStatsQuery } from "../../redux/feature/others/othersApi";

function DashboardPage() {
  // Ekta year selector dui chart ke control kore, karon API ekbar year niye duto overview-i dey
  const [year, setYear] = useState(dayjs().year().toString());

  const { data: stats, isLoading } = useGetStatsQuery(year);

  const summary = stats?.data?.summary;
  const ownerOverview = stats?.data?.ownerOverview;
  const earningsOverview = stats?.data?.earningsOverview;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 font-title">
      <Stats summary={summary} isLoading={isLoading} />
      <Graph
        year={year}
        onYearChange={setYear}
        ownerOverview={ownerOverview}
        earningsOverview={earningsOverview}
        isLoading={isLoading}
      />
      <RecentJoin />
    </div>
  );
}

export default DashboardPage;
