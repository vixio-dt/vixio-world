import Link from 'next/link'
import { Plus, MapPin, Globe, LayoutList, LayoutGrid } from 'lucide-react'
import { getLocations } from '@/lib/actions/locations'
import { Button, EmptyState } from '@/components/ui'
import { LocationCard, LocationTreeView } from '@/components/locations'
import { cookies } from 'next/headers'

interface LocationsPageProps {
  searchParams: Promise<{ view?: string }>
}

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value
  const params = await searchParams
  const viewMode = params.view || 'tree'

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world to view locations."
      />
    )
  }

  const locations = await getLocations(worldId)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Locations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Places in your world</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Link href="/locations?view=tree">
              <button
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tree'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Tree view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/locations?view=grid">
              <button
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <Link href="/locations/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Location
            </Button>
          </Link>
        </div>
      </div>

      {locations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No locations yet"
          description="Create your first location to start mapping your world."
          action={{
            label: 'Create Location',
            href: '/locations/new',
          }}
        />
      ) : viewMode === 'tree' ? (
        <LocationTreeView locations={locations} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <LocationCard key={location.id} location={location} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
