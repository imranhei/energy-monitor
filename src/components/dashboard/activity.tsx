"use client";

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
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    ring: "ring-emerald-200",
  },
  warning: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    ring: "ring-amber-200",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    ring: "ring-blue-200",
  },
  danger: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    ring: "ring-rose-200",
  },
};

export default function Activity({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-rose-500 to-pink-500">
          <ActivityIcon className="h-4 w-4 text-white" />
        </div>

        <h2 className="font-semibold text-slate-800">Recent activity</h2>
      </div>

      <p className="mb-5 ml-9 text-sm text-slate-400">
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
              className="flex gap-3 rounded-xl bg-slate-50/60 p-3 transition-colors hover:bg-slate-50"
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-2 ${colors.bg} ${colors.text} ${colors.ring}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-slate-700">
                  {item.text}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
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