/**
 * Timeline/Event types for Vixio Worldbuilder
 */

export type EventType = 'historical' | 'plot_point' | 'scheduled' | 'recurring'

export interface TimelineEvent {
  id: string
  name: string
  date: string // In-world date format
  dateSort: number // Numeric value for sorting
  type: EventType
  description: string
  causes: string[]
  consequences: string[]
  locationId: string | null
  characterIds: string[]
  relatedEventIds: string[]
  era: string
  createdAt: string
  updatedAt: string
}

export interface TimelineData {
  events: TimelineEvent[]
}

// For the node-based graph view (time loops, paradoxes)
export interface TimelineNode {
  id: string
  eventId: string
  x: number
  y: number
}

export interface TimelineEdge {
  id: string
  source: string // Node ID
  target: string // Node ID
  type: 'causes' | 'prevents' | 'creates_paradox' | 'time_loop'
  label?: string
}

export interface TimelineGraph {
  nodes: TimelineNode[]
  edges: TimelineEdge[]
}
