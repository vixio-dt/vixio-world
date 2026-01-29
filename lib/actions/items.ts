'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Item } from '@/lib/types/database'

export async function getItems(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('world_id', worldId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching items:', error)
    return []
  }

  return data as unknown as Item[]
}

export async function getItem(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    return null
  }

  return data as unknown as Item
}

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const itemData = {
    world_id: formData.get('world_id') as string,
    name: formData.get('name') as string,
    type: formData.get('type') as string || null,
    description: formData.get('description') as string || null,
    function: formData.get('function') as string || null,
    origin: formData.get('origin') as string || null,
    significance: formData.get('significance') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('items')
    .insert(itemData)
    .select()
    .single()

  if (error) {
    console.error('Error creating item:', error)
    return { error: error.message }
  }

  revalidatePath('/items')
  redirect(`/items/${data.id}`)
}

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const itemData = {
    name: formData.get('name') as string,
    type: formData.get('type') as string || null,
    description: formData.get('description') as string || null,
    function: formData.get('function') as string || null,
    origin: formData.get('origin') as string || null,
    significance: formData.get('significance') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('items')
    .update(itemData)
    .eq('id', id)

  if (error) {
    console.error('Error updating item:', error)
    return { error: error.message }
  }

  revalidatePath('/items')
  revalidatePath(`/items/${id}`)
  redirect(`/items/${id}`)
}

export async function deleteItem(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting item:', error)
    return { error: error.message }
  }

  revalidatePath('/items')
  redirect('/items')
}
