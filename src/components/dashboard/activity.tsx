import {
  Activity as ActivityIcon,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";

const activityIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  danger: XCircle,
};

const activityColors = {
  success: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200 dark:ring-emerald-500/20",
  },
  warning: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200 dark:ring-amber-500/20",
  },
  info: {
    bg: "bg-blue-100 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-200 dark:ring-blue-500/20",
  },
  danger: {
    bg: "bg-rose-100 dark:bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-200 dark:ring-rose-500/20",
  },
};

export default function Activity({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-rose-500 to-pink-500 shadow-sm shadow-rose-500/20">
          <ActivityIcon className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Recent activity
        </h2>
      </div>

      <p className="mb-5 ml-9 text-sm text-slate-400 dark:text-slate-500">
        Latest events from ingestion and validation
      </p>

      <div className="space-y-3">
        {data.map((item: any, i: number) => {
          const Icon =
            activityIcon[item.type as keyof typeof activityIcon] || Info;

          const colors =
            activityColors[item.type as keyof typeof activityColors] ||
            activityColors.info;

          return (
            <div
              key={i}
              className="flex gap-3 rounded-xl bg-slate-50/60 p-3 transition-colors hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60"
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-2 ${colors.bg} ${colors.text} ${colors.ring}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-slate-700 dark:text-slate-300">
                  {item.text}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
