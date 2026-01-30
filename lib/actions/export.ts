'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType } from '@/lib/types/database'

export interface ExportEntity {
  id: string
  name: string
  type: EntityType
  data: Record<string, unknown>
}

export interface ExportData {
  worldName: string
  exportedAt: string
  entities: ExportEntity[]
}

/**
 * Get all entities for export.
 */
export async function getExportData(
  worldId: string,
  entityTypes?: EntityType[]
): Promise<ExportData> {
  const supabase = await createClient()

  // Get world name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: world } = await (supabase as any)
    .from('worlds')
    .select('name')
    .eq('id', worldId)
    .single()
  
  const worldData = world as { name: string } | null

  const entities: ExportEntity[] = []

  const allTypes: { table: string; type: EntityType; nameField: string }[] = [
    { table: 'characters', type: 'character', nameField: 'name' },
    { table: 'locations', type: 'location', nameField: 'name' },
    { table: 'organizations', type: 'organization', nameField: 'name' },
    { table: 'events', type: 'event', nameField: 'name' },
    { table: 'items', type: 'item', nameField: 'name' },
    { table: 'rules', type: 'rule', nameField: 'name' },
    { table: 'stories', type: 'story', nameField: 'title' },
  ]

  const typesToFetch = entityTypes
    ? allTypes.filter((t) => entityTypes.includes(t.type))
    : allTypes

  for (const { table, type, nameField } of typesToFetch) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('world_id', worldId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error(`Error fetching ${table} for export:`, error)
      continue
    }

    if (data) {
      for (const item of data) {
        const record = item as Record<string, unknown>
        entities.push({
          id: record.id as string,
          name: (record[nameField] || record.title) as string,
          type,
          data: record,
        })
      }
    }
  }

  return {
    worldName: worldData?.name || 'Unknown World',
    exportedAt: new Date().toISOString(),
    entities,
  }
}

/**
 * Generate JSON export string.
 */
export async function generateJsonExport(
  worldId: string,
  entityTypes?: EntityType[]
): Promise<string> {
  const data = await getExportData(worldId, entityTypes)
  return JSON.stringify(data, null, 2)
}

/**
 * Generate Markdown export for a single entity.
 */
function entityToMarkdown(entity: ExportEntity): string {
  const { name, type, data } = entity
  const lines: string[] = []

  lines.push(`# ${name}`)
  lines.push('')
  lines.push(`**Type:** ${type}`)
  lines.push('')

  // Add story context if present
  if (data.story_context) {
    lines.push('## Story Context')
    lines.push('')
    lines.push(data.story_context as string)
    lines.push('')
  }

  // Add type-specific fields
  const skipFields = ['id', 'world_id', 'created_at', 'updated_at', 'content_blocks', 'story_context', 'name', 'title']
  
  lines.push('## Details')
  lines.push('')

  for (const [key, value] of Object.entries(data)) {
    if (skipFields.includes(key) || value === null || value === '') continue
    
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    
    if (typeof value === 'string' && value.length > 100) {
      lines.push(`### ${label}`)
      lines.push('')
      lines.push(value)
      lines.push('')
    } else if (Array.isArray(value)) {
      lines.push(`**${label}:** ${value.join(', ')}`)
    } else {
      lines.push(`**${label}:** ${value}`)
    }
  }

  // Add content blocks
  const contentBlocks = data.content_blocks as Array<{ type: string; content: string }> | undefined
  if (contentBlocks && contentBlocks.length > 0) {
    lines.push('')
    lines.push('## Content')
    lines.push('')
    
    for (const block of contentBlocks) {
      if (block.type === 'text') {
        // Clean mentions for markdown
        const cleanContent = block.content.replace(/@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g, '**$3**')
        lines.push(cleanContent)
        lines.push('')
      } else if (block.type === 'model') {
        lines.push(`[3D Model](${block.content})`)
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

/**
 * Generate combined Markdown export.
 */
export async function generateMarkdownExport(
  worldId: string,
  entityTypes?: EntityType[]
): Promise<string> {
  const data = await getExportData(worldId, entityTypes)
  const lines: string[] = []

  lines.push(`# ${data.worldName} - World Bible`)
  lines.push('')
  lines.push(`*Exported: ${new Date(data.exportedAt).toLocaleDateString()}*`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Group by type
  const byType = new Map<EntityType, ExportEntity[]>()
  for (const entity of data.entities) {
    const list = byType.get(entity.type) || []
    list.push(entity)
    byType.set(entity.type, list)
  }

  const typeLabels: Record<EntityType, string> = {
    character: 'Characters',
    location: 'Locations',
    organization: 'Organizations',
    event: 'Events',
    item: 'Items',
    rule: 'Rules',
    story: 'Stories',
  }

  for (const [type, entities] of byType) {
    lines.push(`# ${typeLabels[type]}`)
    lines.push('')
    
    for (const entity of entities) {
      lines.push(entityToMarkdown(entity))
      lines.push('')
      lines.push('---')
      lines.push('')
    }
  }

  return lines.join('\n')
}
