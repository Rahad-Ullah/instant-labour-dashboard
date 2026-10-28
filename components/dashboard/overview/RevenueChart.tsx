"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import YearDropdown from "./YearDropDown";
import { useSearchParams, useRouter } from "next/navigation";
import { usePlatformRevenue } from "@/lib/query/hooks";

type RevenueData = {
  month: string;
  value: number;
};

const renderCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { uv } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "white",
          color: "rgba(0, 0, 0, 0.7)",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "14px",
          width: "100px",
          maxWidth: "200px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="font-semibold">£ {uv.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function GreenAreaChart() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  // Use TanStack Query hook
  const { data: revenueData = [], isLoading } = usePlatformRevenue({ year });

  const handleYearChange = (selectedYear: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", selectedYear);
    router.replace(`?${params.toString()}`);
  };

  const handleMonthChange = (selectedMonth: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", selectedMonth.toString());
    router.replace(`?${params.toString()}`);
  };

  // Transform data for chart
  const chartData = revenueData.map((item: any) => ({
    month: item.month,
    value: item.revenue || item.value || 0,
  }));

  // Normalize data for chart

  const normalizedData = chartData.map((item: RevenueData) => ({
    name: item.month,
    uv: item.value,
  }));

  if (isLoading) {
    return (
      <section className="my-2 bg-white rounded-md text-gray-700">
        <div className="flex justify-between pt-4 px-8 gap-4">
          <h3 className="mb-4 text-[18px] font-medium text-gray-700">
            Total Revenue Monthly
          </h3>
          <div className="flex gap-2">
            <YearDropdown
              selectedYear={year.toString()}
              onChange={handleYearChange}
            />
          </div>
        </div>
        <div className="w-full h-[200px] lg:h-[220px] xl:h-[260px] flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-2 bg-white rounded-md text-gray-700">
      <div className="flex justify-between pt-4 px-8 gap-4">
        <h3 className="mb-4 text-[18px] font-medium text-gray-700">
          Total Revenue Monthly
        </h3>
        <div className="flex gap-2">
          <YearDropdown
            selectedYear={year.toString()}
            onChange={handleYearChange}
          />
        </div>
      </div>

      <div className="w-full h-[200px] lg:h-[220px] xl:h-[260px]">
        <ResponsiveContainer>
          <AreaChart
            data={normalizedData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="40%" stopColor="#0057DC" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 15 }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tick={{ fontSize: 15 }}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
            />
            <Tooltip content={renderCustomTooltip} />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#0057DC"
              fill="url(#colorGreen)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
