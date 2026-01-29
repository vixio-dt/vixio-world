import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { LocationForm } from '@/components/locations'
import { createLocation } from '@/lib/actions/locations'
import { cookies } from 'next/headers'

export default async function NewLocationPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('selected_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before adding a location."
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/locations" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Locations
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Location</CardTitle>
          <CardDescription>
            Add a new place to your world
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationForm
            worldId={worldId}
            action={createLocation}
            submitLabel="Create Location"
          />
        </CardContent>
      </Card>
    </div>
  )
}
