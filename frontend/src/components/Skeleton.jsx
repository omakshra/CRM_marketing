export function KpiCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-3 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-9 w-32 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-20 rounded bg-slate-100" />
    </div>
  );
}

export function PageSkeleton({ cards = 4 }) {
  return (
    <div className="page-shell">
      <div className="page-header animate-pulse">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-slate-100" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <KpiCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="table-shell animate-pulse p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="mb-3 flex gap-4 border-b border-slate-100 pb-3 last:mb-0">
          <div className="h-9 w-9 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-slate-200" />
            <div className="h-3 w-1/4 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
