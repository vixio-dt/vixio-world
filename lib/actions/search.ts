'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType } from '@/lib/types/database'

export interface SearchResult {
  id: string
  name: string
  type: EntityType
  description: string | null
}

/**
 * Search all entity types in a world by name.
 * Used for @mentions autocomplete and global search.
 */
export async function searchEntities(
  worldId: string,
  query: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const supabase = await createClient()
  
  const entityTables: { table: string; type: EntityType; nameField: string; descField: string }[] = [
    { table: 'characters', type: 'character', nameField: 'name', descField: 'personality' },
    { table: 'locations', type: 'location', nameField: 'name', descField: 'description' },
    { table: 'organizations', type: 'organization', nameField: 'name', descField: 'purpose' },
    { table: 'events', type: 'event', nameField: 'name', descField: 'description' },
    { table: 'items', type: 'item', nameField: 'name', descField: 'description' },
    { table: 'rules', type: 'rule', nameField: 'name', descField: 'statement' },
    { table: 'stories', type: 'story', nameField: 'title', descField: 'logline' },
  ]

  const results: SearchResult[] = []
  const searchPattern = `%${query}%`

  for (const { table, type, nameField, descField } of entityTables) {
    const { data, error } = await supabase
      .from(table)
      .select(`id, ${nameField}, ${descField}`)
      .eq('world_id', worldId)
      .ilike(nameField, searchPattern)
      .limit(Math.ceil(limit / entityTables.length))

    if (error) {
      console.error(`Error searching ${table}:`, error)
      continue
    }

    if (data) {
      results.push(
        ...data.map((item: Record<string, unknown>) => ({
          id: item.id as string,
          name: (item[nameField] || item.title) as string,
          type,
          description: (item[descField] || null) as string | null,
        }))
      )
    }
  }

  // Sort by relevance (exact match first, then starts with, then contains)
  const lowerQuery = query.toLowerCase()
  results.sort((a, b) => {
    const aLower = a.name.toLowerCase()
    const bLower = b.name.toLowerCase()
    
    if (aLower === lowerQuery && bLower !== lowerQuery) return -1
    if (bLower === lowerQuery && aLower !== lowerQuery) return 1
    if (aLower.startsWith(lowerQuery) && !bLower.startsWith(lowerQuery)) return -1
    if (bLower.startsWith(lowerQuery) && !aLower.startsWith(lowerQuery)) return 1
    return aLower.localeCompare(bLower)
  })

  return results.slice(0, limit)
}

/**
 * Get all entities for a world (used for graph view).
 */
export async function getAllEntities(worldId: string): Promise<SearchResult[]> {
  return searchEntities(worldId, '', 1000)
}
