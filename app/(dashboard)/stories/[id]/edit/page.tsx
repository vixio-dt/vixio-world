import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { StoryForm } from '@/components/stories'
import { updateStory } from '@/lib/actions/stories'
import type { Story } from '@/lib/types/database'

interface EditStoryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
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

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateStory(id, formData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link 
          href={`/stories/${id}`}
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {str.title}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Story</CardTitle>
          <CardDescription>
            Update {str.title}&apos;s details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryForm
            story={str}
            worldId={str.world_id}
            action={handleUpdate}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
