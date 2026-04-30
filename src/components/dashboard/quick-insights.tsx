export default function QuickInsights({ data }: any) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50 to-blue-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-semibold text-slate-800">Quick insights</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((item: string, i: number) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-white bg-white/80 p-4 shadow-sm"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-cyan-400 text-[10px] font-bold text-white">
              {i + 1}
            </span>

            <p className="text-sm leading-snug text-slate-600">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}