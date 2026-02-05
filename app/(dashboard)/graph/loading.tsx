export default function GraphLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="h-[600px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  )
}
