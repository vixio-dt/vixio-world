'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Organization } from '@/lib/types/database'

export async function getOrganizations(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('world_id', worldId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching organizations:', error)
    return []
  }

  return data as unknown as Organization[]
}

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const orgData = {
    world_id: formData.get('world_id') as string,
    name: formData.get('name') as string,
    type: formData.get('type') as string || null,
    purpose: formData.get('purpose') as string || null,
    structure: formData.get('structure') as string || null,
    leadership: formData.get('leadership') as string || null,
    beliefs: formData.get('beliefs') as string || null,
    history: formData.get('history') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('organizations')
    .insert(orgData)
    .select()
    .single()

  if (error) {
    console.error('Error creating organization:', error)
    return { error: error.message }
  }

  revalidatePath('/organizations')
  redirect(`/organizations/${data.id}`)
}

export async function updateOrganization(id: string, formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const orgData = {
    name: formData.get('name') as string,
    type: formData.get('type') as string || null,
    purpose: formData.get('purpose') as string || null,
    structure: formData.get('structure') as string || null,
    leadership: formData.get('leadership') as string || null,
    beliefs: formData.get('beliefs') as string || null,
    history: formData.get('history') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('organizations')
    .update(orgData)
    .eq('id', id)

  if (error) {
    console.error('Error updating organization:', error)
    return { error: error.message }
  }

  revalidatePath('/organizations')
  revalidatePath(`/organizations/${id}`)
  redirect(`/organizations/${id}`)
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('organizations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting organization:', error)
    return { error: error.message }
  }

  revalidatePath('/organizations')
  redirect('/organizations')
}
