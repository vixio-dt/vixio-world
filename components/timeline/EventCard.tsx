'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import type { WorldEvent } from '@/lib/types/database'

interface EventCardProps {
  event: WorldEvent
}

const typeLabels: Record<string, string> = {
  historical: 'Historical',
  plot_point: 'Plot Point',
  scheduled: 'Scheduled',
  recurring: 'Recurring',
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/timeline/${event.id}`}>
      <Card className="hover:border-cyan-300 dark:hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Calendar className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{event.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {event.date && <span>{event.date}</span>}
                {event.date && event.type && <span>·</span>}
                {event.type && <span>{typeLabels[event.type] || event.type}</span>}
              </div>
              {event.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{event.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
