import { FaUsers } from "react-icons/fa";
import { IoCardOutline } from "react-icons/io5";
import { Skeleton } from "antd";

const formatNumber = (value) => Number(value ?? 0).toLocaleString();
const formatMoney = (value) =>
  `$${Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const Stats = ({ summary, isLoading }) => {
  const cards = [
    {
      label: "Total Owner",
      value: formatNumber(summary?.totalOwners),
      icon: FaUsers,
    },
    {
      label: "Total Service Provider",
      value: formatNumber(summary?.totalProviders),
      icon: FaUsers,
    },
    {
      label: "Total Earnings",
      value: formatMoney(summary?.totalAdminEarnings),
      icon: IoCardOutline,
    },
  ];

  return (
    // 1 column on phones, 2 on tablets, 3 on desktop
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }, index) => (
        <div
          key={label}
          className={`flex items-center gap-4 rounded-xl bg-white p-5 shadow-md ${
            // 3rd card full width on tablet so the grid doesn't look lopsided
            index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
          }`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1B2D51] text-white">
            <Icon size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-gray-500 sm:text-base">
              {label}
            </p>
            {isLoading ? (
              <Skeleton.Input
                active
                size="small"
                className="!mt-1 !h-7 !w-24"
              />
            ) : (
              <p className="truncate text-2xl font-semibold text-[#0F0B18]">
                {value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
