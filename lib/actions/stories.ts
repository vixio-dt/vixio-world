'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncEntityMentions } from './mentions'
import type { Story } from '@/lib/types/database'

export async function getStories(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('world_id', worldId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching stories:', error)
    return []
  }

  return data as unknown as Story[]
}

export async function createStory(formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const storyData = {
    world_id: formData.get('world_id') as string,
    title: formData.get('title') as string,
    logline: formData.get('logline') as string || null,
    genre: formData.get('genre') as string || null,
    tone: formData.get('tone') as string || null,
    theme: formData.get('theme') as string || null,
    status: formData.get('status') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('stories')
    .insert(storyData)
    .select()
    .single()

  if (error) {
    console.error('Error creating story:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('story', data.id, allContent)

  revalidatePath('/stories')
  redirect(`/stories/${data.id}`)
}

export async function updateStory(id: string, formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const storyData = {
    title: formData.get('title') as string,
    logline: formData.get('logline') as string || null,
    genre: formData.get('genre') as string || null,
    tone: formData.get('tone') as string || null,
    theme: formData.get('theme') as string || null,
    status: formData.get('status') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('stories')
    .update(storyData)
    .eq('id', id)

  if (error) {
    console.error('Error updating story:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('story', id, allContent)

  revalidatePath('/stories')
  revalidatePath(`/stories/${id}`)
  redirect(`/stories/${id}`)
}

export async function deleteStory(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('stories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting story:', error)
    return { error: error.message }
  }

  revalidatePath('/stories')
  redirect('/stories')
}
