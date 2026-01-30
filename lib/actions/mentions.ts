'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType, EntityMention } from '@/lib/types/database'

interface MentionData {
  type: string
  id: string
  name: string
}

/**
 * Sync entity mentions for a given entity.
 * Parses content for @[type:id:name] markers and updates entity_mentions table.
 */
export async function syncEntityMentions(
  sourceEntityType: EntityType,
  sourceEntityId: string,
  content: string
): Promise<void> {
  const supabase = await createClient()

  // Parse mentions from content
  const mentionRegex = /@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g
  const mentions: MentionData[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      type: match[1],
      id: match[2],
      name: match[3],
    })
  }

  // Delete existing mentions for this source entity
  const { error: deleteError } = await supabase
    .from('entity_mentions')
    .delete()
    .eq('source_entity_id', sourceEntityId)

  if (deleteError) {
    console.error('Error deleting existing mentions:', deleteError)
  }

  // Insert new mentions
  if (mentions.length > 0) {
    const mentionRows = mentions.map((m) => ({
      source_entity_type: sourceEntityType,
      source_entity_id: sourceEntityId,
      target_entity_type: m.type as EntityType,
      target_entity_id: m.id,
      context: m.name,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('entity_mentions') as any).insert(mentionRows)

    if (insertError) {
      console.error('Error inserting mentions:', insertError)
    }
  }
}

/**
 * Get all mentions where this entity is the target (entities that mention this one).
 */
export async function getMentionsOf(
  entityId: string
): Promise<EntityMention[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('entity_mentions')
    .select('*')
    .eq('target_entity_id', entityId)

  if (error) {
    console.error('Error fetching mentions of entity:', error)
    return []
  }

  return data as EntityMention[]
}

/**
 * Get all mentions from this entity (entities this one mentions).
 */
export async function getMentionsFrom(
  entityId: string
): Promise<EntityMention[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('entity_mentions')
    .select('*')
    .eq('source_entity_id', entityId)

  if (error) {
    console.error('Error fetching mentions from entity:', error)
    return []
  }

  return data as EntityMention[]
}

/**
 * Get all mentions for a world (used for graph visualization).
 */
export async function getAllMentionsForWorld(worldId: string): Promise<EntityMention[]> {
  const supabase = await createClient()

  // We need to join through entity tables to filter by world_id
  // Since mentions can be from any entity type, we do multiple queries
  const entityTypes = ['characters', 'locations', 'organizations', 'events', 'items', 'rules', 'stories']
  const allMentions: EntityMention[] = []

  for (const table of entityTypes) {
    const { data: entities } = await supabase
      .from(table)
      .select('id')
      .eq('world_id', worldId)

    if (entities && entities.length > 0) {
      const entityIds = entities.map((e: { id: string }) => e.id)
      
      const { data: mentions } = await supabase
        .from('entity_mentions')
        .select('*')
        .in('source_entity_id', entityIds)

      if (mentions) {
        allMentions.push(...(mentions as EntityMention[]))
      }
    }
  }

  return allMentions
}
