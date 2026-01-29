import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteLocation } from '@/lib/actions/locations'
import type { Location } from '@/lib/types/database'

interface LocationPageProps {
  params: Promise<{ id: string }>
}

const typeLabels: Record<string, string> = {
  planet: 'Planet',
  continent: 'Continent',
  country: 'Country',
  city: 'City',
  district: 'District',
  building: 'Building',
  room: 'Room',
}

export default async function LocationPage({ params }: LocationPageProps) {
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

  async function handleDelete() {
    'use server'
    await deleteLocation(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/locations" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Locations
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl">
            <MapPin className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{loc.name}</h1>
            {loc.type && (
              <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {typeLabels[loc.type] || loc.type}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/locations/${id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive" type="submit">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {loc.story_context && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-emerald-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{loc.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {loc.description && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{loc.description}</p>
            </CardContent>
          </Card>
        )}

        {loc.atmosphere && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Atmosphere</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{loc.atmosphere}</p>
            </CardContent>
          </Card>
        )}

        {loc.climate && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Climate</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{loc.climate}</p>
            </CardContent>
          </Card>
        )}

        {loc.key_features && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Key Features</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{loc.key_features}</p>
            </CardContent>
          </Card>
        )}

        {loc.history && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">History</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{loc.history}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {loc.content_blocks && loc.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={loc.content_blocks} />
        </div>
      )}
    </div>
  )
}
