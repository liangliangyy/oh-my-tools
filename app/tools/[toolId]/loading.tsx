export default function Loading() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="mb-6 pb-4 border-b border-border animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10" />
          <div className="flex-1">
            <div className="h-6 bg-accent/10 rounded w-32 mb-2" />
            <div className="h-4 bg-accent/10 rounded w-48" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-accent/10 rounded animate-pulse" />
        <div className="h-48 bg-accent/10 rounded animate-pulse" />
      </div>
    </div>
  )
}
