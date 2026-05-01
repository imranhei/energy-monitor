import { AlertTriangle } from "lucide-react";

export default function Attention({ data }: any) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-5 shadow-sm transition-all duration-300 dark:border-amber-900/30 dark:from-slate-900 dark:to-amber-950/40">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-400 shadow-sm shadow-amber-200 dark:shadow-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Needs attention</h3>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 mt-3">
            {data.map((item: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl border border-amber-100 bg-white/70 px-4 py-2.5 text-sm text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:shadow-none"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 dark:bg-amber-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}