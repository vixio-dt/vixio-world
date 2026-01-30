'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncEntityMentions } from './mentions'
import type { Character } from '@/lib/types/database'

export async function getCharacters(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('world_id', worldId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching characters:', error)
    return []
  }

  return data as unknown as Character[]
}

export async function getCharacter(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching character:', error)
    return null
  }

  return data as unknown as Character
}

export async function createCharacter(formData: FormData) {
  const supabase = await createClient()

  // Parse content_blocks from JSON if present
  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const characterData = {
    world_id: formData.get('world_id') as string,
    name: formData.get('name') as string,
    role: formData.get('role') as string || null,
    species: formData.get('species') as string || null,
    appearance: formData.get('appearance') as string || null,
    personality: formData.get('personality') as string || null,
    background: formData.get('background') as string || null,
    motivations: formData.get('motivations') as string || null,
    arc_potential: formData.get('arc_potential') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('characters')
    .insert(characterData)
    .select()
    .single()

  if (error) {
    console.error('Error creating character:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('character', data.id, allContent)

  revalidatePath('/characters')
  redirect(`/characters/${data.id}`)
}

export async function updateCharacter(id: string, formData: FormData) {
  const supabase = await createClient()

  // Parse content_blocks from JSON if present
  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const characterData = {
    name: formData.get('name') as string,
    role: formData.get('role') as string || null,
    species: formData.get('species') as string || null,
    appearance: formData.get('appearance') as string || null,
    personality: formData.get('personality') as string || null,
    background: formData.get('background') as string || null,
    motivations: formData.get('motivations') as string || null,
    arc_potential: formData.get('arc_potential') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('characters')
    .update(characterData)
    .eq('id', id)

  if (error) {
    console.error('Error updating character:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('character', id, allContent)

  revalidatePath('/characters')
  revalidatePath(`/characters/${id}`)
  redirect(`/characters/${id}`)
}

export async function deleteCharacter(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('characters')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting character:', error)
    return { error: error.message }
  }

  revalidatePath('/characters')
  redirect('/characters')
}
