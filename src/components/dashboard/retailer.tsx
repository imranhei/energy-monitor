import { Layers } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  data: any[];
  colors: string[];
};

export default function RetailerMix({ data, colors }: Props) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-fuchsia-500 to-pink-500 shadow-sm shadow-fuchsia-500/20">
          <Layers className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Retailer mix</h2>
      </div>

      <p className="mb-2 ml-9 text-sm text-slate-400 dark:text-slate-500">
        Share of bills by retailer this quarter
      </p>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={colors[index % colors.length]}
                    className="stroke-white dark:stroke-slate-900"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#f8fafc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center gap-3 pr-2">
          {data.map((item: any, index: number) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-6 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shadow-sm"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                />

                <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
              </span>

              <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}