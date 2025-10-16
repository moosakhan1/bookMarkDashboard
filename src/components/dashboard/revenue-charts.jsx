"use client"

import { ArrowUpDown } from "lucide-react"
import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

const revenueData = [
  { month: "Jul", value: 250 },
  { month: "Aug", value: 300 },
  { month: "Sep", value: 450 },
  { month: "Oct", value: 780 },
  { month: "Nov", value: 220 },
  { month: "Dec", value: 500 },
  { month: "Jan", value: 600 },
]

const usersData = [
  { month: "Jul", value: 250 },
  { month: "Aug", value: 300 },
  { month: "Sep", value: 450 },
  { month: "Oct", value: 780 },
  { month: "Nov", value: 220 },
  { month: "Dec", value: 500 },
  { month: "Jan", value: 600 },
]

export function RevenueCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Monthly Revenue Card */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Monthly Revenue</h3>
          <button className="flex items-center cursor-pointer gap-2 px-2 py-1 text-gray-500 text-sm border border-gray-100 rounded-md">
            <ArrowUpDown className="h-4 w-4" />
            Sort by
          </button>
        </div>
        <div className="p-4 h-[220px] sm:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EEFF0080" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EEFF0000" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 12 }}
                ticks={[0, 200, 400, 600, 800]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#facc15"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1.5, fill: "#facc15" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Users Card */}
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">New Users</h3>
          <button className="flex items-center gap-2 px-2 py-1 text-gray-500 text-sm border border-gray-100 cursor-pointer rounded-md">
            <ArrowUpDown className="h-4 w-4" />
            Sort by
          </button>
        </div>
        <div className="p-4 h-[220px] sm:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usersData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EEFF0080" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EEFF0000" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 12 }}
                ticks={[0, 200, 400, 600, 800]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#facc15"
                strokeWidth={2}
                fill="url(#colorUsers)"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1.5, fill: "#facc15" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
