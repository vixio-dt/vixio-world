'use server'

import { createClient } from '@/lib/supabase/server'
import type { EntityType } from '@/lib/types/database'

export interface GraphNode {
  id: string
  name: string
  type: EntityType
  connectionCount: number
}

export interface GraphEdge {
  source: string
  target: string
  type: 'mention'
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

/**
 * Get graph data (nodes and edges) for a world.
 * Nodes are entities, edges are mentions.
 */
export async function getGraphData(worldId: string): Promise<GraphData> {
  const supabase = await createClient()

  const nodes: GraphNode[] = []
  const nodeIds = new Set<string>()

  // Fetch all entities as nodes
  const entityTables: { table: string; type: EntityType; nameField: string }[] = [
    { table: 'characters', type: 'character', nameField: 'name' },
    { table: 'locations', type: 'location', nameField: 'name' },
    { table: 'organizations', type: 'organization', nameField: 'name' },
    { table: 'events', type: 'event', nameField: 'name' },
    { table: 'items', type: 'item', nameField: 'name' },
    { table: 'rules', type: 'rule', nameField: 'name' },
    { table: 'stories', type: 'story', nameField: 'title' },
  ]

  for (const { table, type, nameField } of entityTables) {
    const { data, error } = await supabase
      .from(table)
      .select(`id, ${nameField}`)
      .eq('world_id', worldId)

    if (error) {
      console.error(`Error fetching ${table} for graph:`, error)
      continue
    }

    if (data) {
      for (const item of data) {
        const record = item as Record<string, unknown>
        const name = (record[nameField] || record.title) as string
        nodes.push({
          id: record.id as string,
          name,
          type,
          connectionCount: 0,
        })
        nodeIds.add(record.id as string)
      }
    }
  }

  // Fetch all mentions as edges
  const edges: GraphEdge[] = []
  const entityIds = Array.from(nodeIds)

  if (entityIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: mentions, error } = await (supabase.from('entity_mentions') as any)
      .select('source_entity_id, target_entity_id')
      .in('source_entity_id', entityIds)

    if (error) {
      console.error('Error fetching mentions for graph:', error)
    } else if (mentions) {
      for (const mention of mentions) {
        // Only include edges where both nodes exist
        if (nodeIds.has(mention.source_entity_id) && nodeIds.has(mention.target_entity_id)) {
          edges.push({
            source: mention.source_entity_id,
            target: mention.target_entity_id,
            type: 'mention',
          })
        }
      }
    }
  }

  // Calculate connection counts
  const connectionCounts = new Map<string, number>()
  for (const edge of edges) {
    connectionCounts.set(edge.source, (connectionCounts.get(edge.source) || 0) + 1)
    connectionCounts.set(edge.target, (connectionCounts.get(edge.target) || 0) + 1)
  }

  // Update node connection counts
  for (const node of nodes) {
    node.connectionCount = connectionCounts.get(node.id) || 0
  }

  return { nodes, edges }
}
