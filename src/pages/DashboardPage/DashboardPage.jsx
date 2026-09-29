/* eslint-disable no-unused-vars */
import { useState } from "react";
import dayjs from "dayjs";
import Stats from "../../component/DashboardPage/Stats";
import Graph from "../../component/DashboardPage/Graph";
import RecentJoin from "../../component/DashboardPage/RecentJoin";
import { useGetStatsQuery } from "../../redux/feature/others/othersApi";

function DashboardPage() {
  const currentYearStr = dayjs().year().toString(); // বর্তমান বছর (string হিসেবে)
  
  // ডিফল্টভাবে বর্তমান বছর সেট করা হয়েছে
  const [ownerYear, setOwnerYear] = useState(currentYearStr);
  const [earningYear, setEarningYear] = useState(currentYearStr);

  // আপনার API যদি একটি বছর নেয় এবং সব ডাটা দেয়, তবে এখানে ownerYear পাস করা হয়েছে
  const { data: stats } = useGetStatsQuery(ownerYear); 
  
  const summary = stats?.data?.summary;
  const ownerOverview = stats?.data?.ownerOverview;
  const earningsOverview = stats?.data?.earningsOverview;

  return (
    <div className="container mx-auto font-title mb-5">
      <Stats summary={summary} />
      <Graph
        ownerOverview={ownerOverview}
        setOwnerYear={setOwnerYear}
        setEarningYear={setEarningYear}  
        earningYear={earningYear}
        ownerYear={ownerYear}
        earningsOverview={earningsOverview}
      />
      <RecentJoin />
    </div>
  );
}

export default DashboardPage;