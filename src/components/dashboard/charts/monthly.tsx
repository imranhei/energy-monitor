"use client";

import {
  Activity,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: any[];
  AreaTooltip: any;
};

export default function MonthlyChart({ data, AreaTooltip }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-cyan-500">
          <Activity className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800">
          Monthly consumption trend
        </h2>
      </div>

      <p className="mb-5 ml-9 text-sm text-slate-400">
        Current year compared with prior year
      </p>

      <div className="mb-4 ml-9 flex items-center gap-6">
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2.5 w-5 rounded-full bg-indigo-500" />
          Current year
        </span>

        <span className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2.5 w-5 rounded-full bg-slate-300" />
          Previous year
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="gradPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<AreaTooltip />} />

            <Area
              type="monotone"
              dataKey="previous"
              stroke="#94a3b8"
              strokeWidth={2}
              fill="url(#gradPrevious)"
              name="Previous year"
              strokeDasharray="5 3"
            />

            <Area
              type="monotone"
              dataKey="current"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gradCurrent)"
              name="Current year"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}