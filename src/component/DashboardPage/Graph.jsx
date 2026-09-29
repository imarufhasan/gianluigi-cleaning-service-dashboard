import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Skeleton } from "antd";

const AXIS_TICK = { fontSize: 12, fill: "#6B7280" };
const YEARS_TO_SHOW = 10;

const toChartData = (overview) =>
  overview?.monthlyOverview?.map((item) => ({
    month: item.month.slice(0, 3),
    value: item.growthPercentage,
  })) || [];

const tooltipProps = {
  formatter: (value) => [`${value}%`, "Growth"],
  contentStyle: {
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontSize: 13,
  },
};

function ChartCard({ title, isLoading, isEmpty, year, children }) {
  return (
    // min-w-0 stops the chart from pushing the grid wider than the screen
    <div className="min-w-0 rounded-xl bg-white p-4 shadow-md sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
        {title}
      </h2>
      <div className="h-56 sm:h-64 lg:h-72">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} title={false} />
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No data for {year}.
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export default function Graph({
  year,
  onYearChange,
  ownerOverview,
  earningsOverview,
  isLoading,
}) {
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: YEARS_TO_SHOW }, (_, i) => current - i);
  }, []);

  const ownerData = useMemo(() => toChartData(ownerOverview), [ownerOverview]);
  const earningData = useMemo(
    () => toChartData(earningsOverview),
    [earningsOverview],
  );

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>Year</span>
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-[#0F0B18] outline-none focus:border-[#1B2D51]"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Total Owner Overview */}
        <ChartCard
          title="Total Owner Overview"
          isLoading={isLoading}
          isEmpty={ownerData.length === 0}
          year={year}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={ownerData}
              margin={{ top: 5, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ownerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <Tooltip {...tooltipProps} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
              />
              <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#ownerGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Earning Overview */}
        <ChartCard
          title="Earning Overview"
          isLoading={isLoading}
          isEmpty={earningData.length === 0}
          year={year}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={earningData}
              margin={{ top: 5, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <Tooltip {...tooltipProps} cursor={{ fill: "#F3F4F6" }} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK}
              />
              <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} />
              <Bar
                dataKey="value"
                fill="#1B2D51"
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
