import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '@/components/ui'
import { EventForm } from '@/components/timeline'
import { createEvent } from '@/lib/actions/events'
import { cookies } from 'next/headers'

export default async function NewEventPage() {
  const cookieStore = await cookies()
  const worldId = cookieStore.get('current_world_id')?.value

  if (!worldId) {
    return (
      <EmptyState
        icon={Globe}
        title="No world selected"
        description="Please select or create a world before adding an event."
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/timeline" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Timeline
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Event</CardTitle>
          <CardDescription>
            Add a new event to your world&apos;s timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm
            worldId={worldId}
            action={createEvent}
            submitLabel="Create Event"
          />
        </CardContent>
      </Card>
    </div>
  )
}
