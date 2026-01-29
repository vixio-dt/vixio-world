import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { LocationForm } from '@/components/locations'
import { updateLocation } from '@/lib/actions/locations'
import type { Location } from '@/lib/types/database'

interface EditLocationPageProps {
  params: Promise<{ id: string }>
}

export default async function EditLocationPage({ params }: EditLocationPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: location, error } = await (supabase as any)
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !location) {
    notFound()
  }

  const loc = location as unknown as Location

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateLocation(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/locations/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {loc.name}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Location</CardTitle>
          <CardDescription>
            Update {loc.name}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationForm
            location={loc}
            worldId={loc.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
