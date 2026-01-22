import { Scale, Plus } from 'lucide-react'

export function RulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Rules
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            World laws, physics, and constraints
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      <EmptyState
        icon={Scale}
        title="No rules yet"
        description="Define how your world works"
      />
    </div>
  )
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}
