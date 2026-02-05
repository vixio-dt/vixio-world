import Link from 'next/link'
import { Plus, Calendar, Globe, LayoutGrid, LayoutList } from 'lucide-react'
import { getEvents } from '@/lib/actions/events'
import { Button, EmptyState } from '@/components/ui'
import { TimelineView, EventCard } from '@/components/timeline'
import { cookies } from 'next/headers'

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value
  const params = await searchParams
  const viewMode = params.view || 'timeline'

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view the timeline."
      />
    )
  }

  const events = await getEvents(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Timeline</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Events and history of your world</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Link href="/timeline?view=timeline">
              <button 
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-600 dark:text-cyan-400' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Timeline view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/timeline?view=grid">
              <button 
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-600 dark:text-cyan-400' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </Link>
          </div>
          
          <Link href="/timeline/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Create your first event to build your world's history."
          action={{
            label: 'Create Event',
            href: '/timeline/new',
          }}
        />
      ) : viewMode === 'timeline' ? (
        <TimelineView events={events} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
