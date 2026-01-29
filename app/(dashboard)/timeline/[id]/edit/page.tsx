import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { EventForm } from '@/components/timeline'
import { updateEvent } from '@/lib/actions/events'
import type { WorldEvent } from '@/lib/types/database'

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: event, error } = await (supabase as any)
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  const evt = event as unknown as WorldEvent

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateEvent(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/timeline/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {evt.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>
            Update {evt.name}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm
            event={evt}
            worldId={evt.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
