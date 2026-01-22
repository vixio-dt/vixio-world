import { useState } from 'react'
import { Search, Filter, List, GitBranch } from 'lucide-react'
import { EventCard } from './EventCard'
import { cn } from '@/lib/utils'
import type { TimelineEvent, EventType } from '@product/sections/timeline/types'

const typeFilters: { value: EventType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'historical', label: 'Historical' },
  { value: 'plot_point', label: 'Plot Points' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'recurring', label: 'Recurring' },
]

interface TimelineViewProps {
  events: TimelineEvent[]
  selectedId?: string
  onSelect?: (event: TimelineEvent) => void
}

export function TimelineView({ events, selectedId, onSelect }: TimelineViewProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list')

  const filtered = events
    .filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === 'all' || event.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => a.dateSort - b.dateSort)

  // Group events by era
  const groupedByEra = filtered.reduce((acc, event) => {
    const era = event.era || 'Unknown Era'
    if (!acc[era]) acc[era] = []
    acc[era].push(event)
    return acc
  }, {} as Record<string, TimelineEvent[]>)

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventType | 'all')}
              className="pl-10 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
            >
              {typeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('graph')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'graph'
                  ? 'bg-sky-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              )}
              title="Graph View"
            >
              <GitBranch className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {filtered.length} event{filtered.length !== 1 ? 's' : ''}
      </p>

      {viewMode === 'list' ? (
        /* Timeline List View */
        <div className="space-y-8">
          {Object.entries(groupedByEra).map(([era, eraEvents]) => (
            <div key={era}>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                {era}
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                
                <div className="space-y-4">
                  {eraEvents.map((event, index) => (
                    <div key={event.id} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className={cn(
                        'absolute left-2 top-4 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900',
                        event.type === 'plot_point' ? 'bg-rose-500' :
                        event.type === 'historical' ? 'bg-amber-500' :
                        event.type === 'scheduled' ? 'bg-blue-500' :
                        'bg-purple-500'
                      )} />
                      
                      <EventCard
                        event={event}
                        selected={event.id === selectedId}
                        onClick={() => onSelect?.(event)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Graph View Placeholder */
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 text-center">
          <GitBranch className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Node-Based Graph View
          </h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Visualize time loops, paradoxes, and causal chains. 
            AI integration can auto-generate graphs from your event data.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
            Coming in a future update
          </p>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No events found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}
