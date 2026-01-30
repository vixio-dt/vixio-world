'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncEntityMentions } from './mentions'
import type { Rule } from '@/lib/types/database'

export async function getRules(worldId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('rules')
    .select('*')
    .eq('world_id', worldId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rules:', error)
    return []
  }

  return data as unknown as Rule[]
}

export async function createRule(formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const ruleData = {
    world_id: formData.get('world_id') as string,
    name: formData.get('name') as string,
    category: formData.get('category') as string || null,
    statement: formData.get('statement') as string || null,
    scope: formData.get('scope') as string || null,
    exceptions: formData.get('exceptions') as string || null,
    consequences: formData.get('consequences') as string || null,
    examples: formData.get('examples') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('rules')
    .insert(ruleData)
    .select()
    .single()

  if (error) {
    console.error('Error creating rule:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('rule', data.id, allContent)

  revalidatePath('/rules')
  redirect(`/rules/${data.id}`)
}

export async function updateRule(id: string, formData: FormData) {
  const supabase = await createClient()

  const contentBlocksRaw = formData.get('content_blocks') as string
  const content_blocks = contentBlocksRaw ? JSON.parse(contentBlocksRaw) : []

  const ruleData = {
    name: formData.get('name') as string,
    category: formData.get('category') as string || null,
    statement: formData.get('statement') as string || null,
    scope: formData.get('scope') as string || null,
    exceptions: formData.get('exceptions') as string || null,
    consequences: formData.get('consequences') as string || null,
    examples: formData.get('examples') as string || null,
    story_context: formData.get('story_context') as string || null,
    content_blocks,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('rules')
    .update(ruleData)
    .eq('id', id)

  if (error) {
    console.error('Error updating rule:', error)
    return { error: error.message }
  }

  // Sync mentions from content blocks
  const allContent = content_blocks.map((b: { content: string }) => b.content).join('\n')
  await syncEntityMentions('rule', id, allContent)

  revalidatePath('/rules')
  revalidatePath(`/rules/${id}`)
  redirect(`/rules/${id}`)
}

export async function deleteRule(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('rules')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting rule:', error)
    return { error: error.message }
  }

  revalidatePath('/rules')
  redirect('/rules')
}
