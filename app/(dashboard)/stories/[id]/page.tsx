import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button, Card, CardContent } from '@/components/ui'
import { ContentBlocksDisplay } from '@/components/content-blocks'
import { deleteStory } from '@/lib/actions/stories'
import type { Story } from '@/lib/types/database'

interface StoryPageProps {
  params: Promise<{ id: string }>
}

const statusLabels: Record<string, string> = {
  concept: 'Concept',
  outline: 'Outline',
  draft: 'Draft',
  complete: 'Complete',
}

const statusColors: Record<string, string> = {
  concept: 'bg-slate-100 text-slate-700',
  outline: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700',
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: story, error } = await (supabase as any)
    .from('stories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !story) {
    notFound()
  }

  const str = story as unknown as Story

  async function handleDelete() {
    'use server'
    await deleteStory(id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/stories" 
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Stories
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-cyan-50 rounded-xl">
            <BookOpen className="w-8 h-8 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{str.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              {str.status && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[str.status] || 'bg-slate-100 text-slate-700'}`}>
                  {statusLabels[str.status] || str.status}
                </span>
              )}
              {str.genre && (
                <span className="text-slate-600">{str.genre}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/stories/${id}/edit`}>
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

      {str.story_context && (
        <Card className="mb-6 border-cyan-200 bg-cyan-50">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-cyan-700 mb-1">Story Context</h3>
            <p className="text-slate-900 whitespace-pre-wrap">{str.story_context}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {str.logline && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Logline</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{str.logline}</p>
            </CardContent>
          </Card>
        )}

        {str.tone && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Tone</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{str.tone}</p>
            </CardContent>
          </Card>
        )}

        {str.theme && (
          <Card>
            <CardContent className="py-4">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Theme</h3>
              <p className="text-slate-900 whitespace-pre-wrap">{str.theme}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {str.content_blocks && str.content_blocks.length > 0 && (
        <div className="mt-8">
          <ContentBlocksDisplay blocks={str.content_blocks} />
        </div>
      )}
    </div>
  )
}
