export default function SummaryCards({ data = [], cardGradients, cardIcons }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((card: any, i: number) => {
        const cfg = cardGradients[i];
        if (!cfg) return null;

        const Icon = cardIcons[cfg.icon];
        const isNeg = card.change < 0;
        const isPos = card.change > 0;

        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl border bg-linear-to-br ${cfg.soft} ${cfg.border} p-5 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/50 dark:bg-none`}
          >
            {/* Decorative gradient overlay */}
            <div
              className={`absolute -right-6 -top-6 h-28 w-28 rounded-full bg-linear-to-br ${cfg.gradient} opacity-10 dark:opacity-20`}
            />

            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br ${cfg.gradient} shadow-lg shadow-indigo-500/20`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="mt-3 flex items-end gap-1.5">
              <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                {card.value}
              </span>

              {card.unit && (
                <span className="mb-1 text-sm text-slate-400 dark:text-slate-500">{card.unit}</span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isNeg
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : isPos
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {isPos && "+"}
                {card.change}%
              </span>

              <span className="text-xs text-slate-400 dark:text-slate-500">{card.helper}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
