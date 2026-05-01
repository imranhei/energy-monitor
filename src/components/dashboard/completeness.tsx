"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function Completeness({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/20">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Data completeness</h2>
      </div>

      <p className="mb-6 ml-9 text-sm text-slate-400 dark:text-slate-500">
        How complete the reporting data is
      </p>

      <div className="space-y-5">
        {data.map((item) => {
          const isWarning = item.color === "warning";

          const barColor = isWarning
            ? "from-amber-400 to-orange-400"
            : item.value === 100
              ? "from-emerald-500 to-teal-400"
              : "from-indigo-500 to-cyan-400";

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isWarning ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                  />

                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      isWarning ? "text-amber-600 dark:text-amber-400" : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {item.value}%
                  </span>

                  {item.value === 100 && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  )}
                </div>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/50">
                <div
                  className={`h-3 rounded-full bg-linear-to-r ${barColor} transition-all duration-700 shadow-sm`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}