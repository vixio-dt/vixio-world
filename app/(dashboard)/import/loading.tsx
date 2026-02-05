export default function ImportLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto animate-pulse" />
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
