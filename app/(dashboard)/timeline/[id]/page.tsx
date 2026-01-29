import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteEvent } from '@/lib/actions/events'
import type { WorldEvent } from '@/lib/types/database'

interface EventPageProps {
  params: Promise<{ id: string }>
}

const typeLabels: Record<string, string> = {
  historical: 'Historical',
  plot_point: 'Plot Point',
  scheduled: 'Scheduled',
  recurring: 'Recurring',
}

export default async function EventPage({ params }: EventPageProps) {
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

  async function handleDelete() {
    'use server'
    await deleteEvent(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/timeline" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Timeline
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-rose-50 rounded-xl">
            <Calendar className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{evt.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {evt.date && (
                <span className="text-slate-600">{evt.date}</span>
              )}
              {evt.type && (
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                  {typeLabels[evt.type] || evt.type}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/timeline/${id}/edit`}>
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

      {evt.story_context && (
        <Card className="mb-6 border-rose-200 bg-rose-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-rose-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{evt.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {evt.description && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Description</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{evt.description}</p>
            </CardContent>
          </Card>
        )}

        {evt.causes && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Causes</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{evt.causes}</p>
            </CardContent>
          </Card>
        )}

        {evt.consequences && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Consequences</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{evt.consequences}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {evt.content_blocks && evt.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={evt.content_blocks} />
        </div>
      )}
    </div>
  )
}
