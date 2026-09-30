const PLACEHOLDER_COUNT = 3

export function InsightsSkeleton() {
  return (
    <div role="status" aria-label="Loading insights" className="space-y-4">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="animate-pulse space-y-3 rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="h-5 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-5/6 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
