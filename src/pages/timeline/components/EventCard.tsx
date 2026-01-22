import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { WorldEvent } from '@/types/database'

interface EventCardProps {
  event: WorldEvent
  onClick: () => void
}

const typeColors: Record<string, 'amber' | 'sky' | 'violet' | 'emerald'> = {
  historical: 'amber',
  plot_point: 'sky',
  scheduled: 'violet',
  recurring: 'emerald',
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors p-4'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {event.type && (
              <Badge variant={typeColors[event.type] || 'slate'} size="sm">
                {event.type.replace('_', ' ')}
              </Badge>
            )}
            {event.date && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {event.date}
              </span>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
