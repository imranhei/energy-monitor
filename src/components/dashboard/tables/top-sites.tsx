"use client";

import { ArrowDownRight, ArrowUpRight, BarChart2 } from "lucide-react";

const formatNumber = (value: number) => value.toLocaleString();

const STATE_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#e11d48",
  "#8b5cf6",
];

const statusStyle: Record<string, string> = {
  "Needs review": "bg-rose-100 text-rose-700 border border-rose-200",
  Normal: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Estimated read": "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function TopSites({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-500">
          <BarChart2 className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800">
          Highest-consuming sites
        </h2>
      </div>

      <p className="mb-5 ml-9 text-sm text-slate-400">
        Focus on the sites with the largest usage
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Site
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                State
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Usage kWh
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Spend
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                kWh/m²
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Change
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {data.map((site: any, i: number) => (
              <tr
                key={site.site}
                className="group transition-colors hover:bg-slate-50/60"
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                      style={{
                        background: STATE_COLORS[i % STATE_COLORS.length],
                      }}
                    >
                      {i + 1}
                    </span>

                    <span className="font-medium text-slate-700">
                      {site.site}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 text-slate-500">{site.state}</td>

                <td className="py-3.5 font-mono text-slate-700">
                  {formatNumber(site.kwh)}
                </td>

                <td className="py-3.5 text-slate-700">{site.spend}</td>

                <td className="py-3.5 text-slate-500">{site.intensity}</td>

                <td className="py-3.5">
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold ${
                      site.change > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {site.change > 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(site.change)}%
                  </span>
                </td>

                <td className="py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusStyle[site.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {site.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}