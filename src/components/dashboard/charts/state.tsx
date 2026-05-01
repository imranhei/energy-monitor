import { MapPin } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: any[];
  colors: string[];
};

export default function StateChart({ data, colors }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-teal-500 shadow-sm shadow-cyan-500/20">
          <MapPin className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Consumption by state
        </h2>
      </div>

      <p className="mb-5 ml-9 text-sm text-slate-400 dark:text-slate-500">
        Where most energy is being used
      </p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 5, right: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              horizontal={false}
              className="dark:stroke-slate-800/50"
            />

            <XAxis
              type="number"
              tickFormatter={(v) => `${v / 1000}K`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              className="dark:[&_text]:fill-slate-500"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              dataKey="state"
              type="category"
              tick={{
                fontSize: 12,
                fill: "#64748b",
                fontWeight: 600,
              }}
              className="dark:[&_text]:fill-slate-400"
              axisLine={false}
              tickLine={false}
              width={32}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#f8fafc" }}
            />

            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((_: any, index: number) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
