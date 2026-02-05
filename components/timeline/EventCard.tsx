'use client'

import Link from 'next/link'
import { Calendar, History, Milestone, Clock, Repeat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { WorldEvent } from '@/lib/types/database'

interface EventCardProps {
  event: WorldEvent
}

const typeConfig: Record<string, { label: string; icon: typeof Calendar; bgClass: string; iconClass: string }> = {
  historical: { 
    label: 'Historical', 
    icon: History, 
    bgClass: 'bg-slate-100 dark:bg-slate-800', 
    iconClass: 'text-slate-600 dark:text-slate-400' 
  },
  plot_point: { 
    label: 'Plot Point', 
    icon: Milestone, 
    bgClass: 'bg-rose-50 dark:bg-rose-900/30', 
    iconClass: 'text-rose-600 dark:text-rose-400' 
  },
  scheduled: { 
    label: 'Scheduled', 
    icon: Clock, 
    bgClass: 'bg-cyan-50 dark:bg-cyan-900/30', 
    iconClass: 'text-cyan-600 dark:text-cyan-400' 
  },
  recurring: { 
    label: 'Recurring', 
    icon: Repeat, 
    bgClass: 'bg-violet-50 dark:bg-violet-900/30', 
    iconClass: 'text-violet-600 dark:text-violet-400' 
  },
}

export function EventCard({ event }: EventCardProps) {
  const config = typeConfig[event.type || 'historical'] || typeConfig.historical
  const Icon = config.icon
  
  return (
    <Link href={`/timeline/${event.id}`}>
      <Card className="hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${config.bgClass}`}>
              <Icon className={`w-5 h-5 ${config.iconClass}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{event.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {event.date && <span>{event.date}</span>}
                {event.date && event.type && <span>·</span>}
                {event.type && <span>{config.label}</span>}
              </div>
              {event.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{event.description}</p>
              )}
              {event.story_context && (
                <div className="mt-2 px-2 py-1 rounded bg-cyan-50 dark:bg-cyan-900/20 border-l-2 border-cyan-400">
                  <p className="text-xs text-cyan-700 dark:text-cyan-300 line-clamp-1">{event.story_context}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
