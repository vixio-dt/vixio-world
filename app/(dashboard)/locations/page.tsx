import Link from 'next/link'
import { Plus, MapPin, Globe } from 'lucide-react'
import { getLocations } from '@/lib/actions/locations'
import { Button, EmptyState } from '@/components/ui'
import { LocationCard } from '@/components/locations'
import { cookies } from 'next/headers'

export default async function LocationsPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('selected_world_id')?.value

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
          <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-500 mt-1">Places in your world</p>
        </div>
        <Link href="/locations/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Location
          </Button>
        </Link>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  )
}
