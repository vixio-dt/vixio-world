import { useState, useMemo } from 'react'
import { Clock, Plus } from 'lucide-react'
import { SearchInput, Select, EmptyState, Button } from '@/components/ui'
import { EventCard } from './EventCard'
import type { WorldEvent } from '@/types/database'

interface EventListProps {
  events: WorldEvent[]
  loading: boolean
  onSelect: (event: WorldEvent) => void
  onCreateNew: () => void
}

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'historical', label: 'Historical' },
  { value: 'plot_point', label: 'Plot Point' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'recurring', label: 'Recurring' },
]

export function EventList({ events, loading, onSelect, onCreateNew }: EventListProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        if (search) {
          const searchLower = search.toLowerCase()
          const matchesSearch =
            event.name.toLowerCase().includes(searchLower) ||
            event.description?.toLowerCase().includes(searchLower) ||
            event.date?.toLowerCase().includes(searchLower)
          if (!matchesSearch) return false
        }
        if (typeFilter !== 'all' && event.type !== typeFilter) return false
        return true
      })
      .sort((a, b) => (a.date_sort || 0) - (b.date_sort || 0))
  }, [events, search, typeFilter])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Timeline
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Events and history of your world
          </p>
        </div>
        <Button onClick={onCreateNew} icon={<Plus className="w-4 h-4" />}>
          Add Event
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search events..."
          className="flex-1"
        />
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>

      {filteredEvents.length === 0 ? (
        events.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No events yet"
            description="Document the history and timeline of your world."
            action={{ label: 'Create Event', onClick: onCreateNew }}
          />
        ) : (
          <EmptyState
            icon={Clock}
            title="No events match your search"
            description="Try adjusting your filters or search term"
          />
        )
      ) : (
        <div className="space-y-3">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onClick={() => onSelect(event)} />
          ))}
        </div>
      )}
    </div>
  )
}
