'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncEntityMentions } from './mentions'
import type { WorldEvent } from '@/lib/types/database'

export async function getEvents(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('world_id', worldId)
    .order('date_sort', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data as unknown as WorldEvent[]
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const eventData = {
    world_id: formData.get('world_id') as string,
    name: formData.get('name') as string,
    date: formData.get('date') as string || null,
    type: formData.get('type') as string || null,
    description: formData.get('description') as string || null,
    causes: formData.get('causes') as string || null,
    consequences: formData.get('consequences') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('events')
    .insert(eventData)
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('event', data.id, allContent)

  revalidatePath('/timeline')
  redirect(`/timeline/${data.id}`)
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const eventData = {
    name: formData.get('name') as string,
    date: formData.get('date') as string || null,
    type: formData.get('type') as string || null,
    description: formData.get('description') as string || null,
    causes: formData.get('causes') as string || null,
    consequences: formData.get('consequences') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('events')
    .update(eventData)
    .eq('id', id)

  if (error) {
    console.error('Error updating event:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('event', id, allContent)

  revalidatePath('/timeline')
  revalidatePath(`/timeline/${id}`)
  redirect(`/timeline/${id}`)
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting event:', error)
    return { error: error.message }
  }

  revalidatePath('/timeline')
  redirect('/timeline')
}
