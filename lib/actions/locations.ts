'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Location } from '@/lib/types/database'

export async function getLocations(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('world_id', worldId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching locations:', error)
    return []
  }

  return data as unknown as Location[]
}

export async function getLocation(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching location:', error)
    return null
  }

  return data as unknown as Location
}

export async function createLocation(formData: FormData) {
  const supabase = await createClient()

  // Parse content_blocks from JSON if present
  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const locationData = {
    world_id: formData.get('world_id') as string,
    name: formData.get('name') as string,
    type: formData.get('type') as string || null,
    description: formData.get('description') as string || null,
    atmosphere: formData.get('atmosphere') as string || null,
    climate: formData.get('climate') as string || null,
    key_features: formData.get('key_features') as string || null,
    history: formData.get('history') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('locations')
    .insert(locationData)
    .select()
    .single()

  if (error) {
    console.error('Error creating location:', error)
    return { error: error.message }
  }

  revalidatePath('/locations')
  redirect(`/locations/${data.id}`)
}

export async function updateLocation(id: string, formData: FormData) {
  const supabase = await createClient()

  // Parse content_blocks from JSON if present
  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const locationData = {
    name: formData.get('name') as string,
    type: formData.get('type') as string || null,
    description: formData.get('description') as string || null,
    atmosphere: formData.get('atmosphere') as string || null,
    climate: formData.get('climate') as string || null,
    key_features: formData.get('key_features') as string || null,
    history: formData.get('history') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('locations')
    .update(locationData)
    .eq('id', id)

  if (error) {
    console.error('Error updating location:', error)
    return { error: error.message }
  }

  revalidatePath('/locations')
  revalidatePath(`/locations/${id}`)
  redirect(`/locations/${id}`)
}

export async function deleteLocation(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('locations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting location:', error)
    return { error: error.message }
  }

  revalidatePath('/locations')
  redirect('/locations')
}
