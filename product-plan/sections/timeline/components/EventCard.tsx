import { Calendar, MapPin, Users, ArrowRight, History, Target, Clock, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TimelineEvent, EventType } from '@product/sections/timeline/types'

const typeConfig: Record<EventType, { icon: typeof History; label: string; color: string }> = {
  historical: { icon: History, label: 'Historical', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  plot_point: { icon: Target, label: 'Plot Point', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  scheduled: { icon: Clock, label: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  recurring: { icon: Repeat, label: 'Recurring', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
}

interface EventCardProps {
  event: TimelineEvent
  onClick?: () => void
  selected?: boolean
  compact?: boolean
}

export function EventCard({ event, onClick, selected, compact }: EventCardProps) {
  const config = typeConfig[event.type]
  const Icon = config.icon

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left p-3 rounded-lg border transition-all duration-200',
          'hover:shadow-sm hover:border-sky-200 dark:hover:border-sky-800',
          selected
            ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-1.5 rounded-full', config.color)}>
            <Icon className="h-3 w-3" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 dark:text-white truncate text-sm">
              {event.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">{event.date}</p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-xl border transition-all duration-200',
        'hover:shadow-md hover:border-sky-200 dark:hover:border-sky-800',
        selected
          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full', config.color)}>
              <Icon className="h-3 w-3" />
              {config.label}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {event.date}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
        {event.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {event.locationId && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Location
          </span>
        )}
        {event.characterIds.length > 0 && (
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {event.characterIds.length} participant{event.characterIds.length !== 1 ? 's' : ''}
          </span>
        )}
        {event.relatedEventIds.length > 0 && (
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            {event.relatedEventIds.length} connection{event.relatedEventIds.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </button>
  )
}
