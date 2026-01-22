import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
