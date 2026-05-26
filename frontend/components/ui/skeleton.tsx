export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-navy/10 bg-white p-5 shadow-card">
      <div className="h-44 rounded-xl bg-slate-100" />
      <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
    </div>
  );
}
