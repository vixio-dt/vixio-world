/**
 * Item types for Vixio Worldbuilder
 */

export type ItemType = 
  | 'weapon'
  | 'vehicle'
  | 'artifact'
  | 'tool'
  | 'document'
  | 'clothing'
  | 'technology'

export type ItemSignificance = 'background' | 'minor' | 'major' | 'critical'

export interface OwnershipRecord {
  ownerId: string | null
  period: string
  notes: string
}

export interface Item {
  id: string
  name: string
  type: ItemType
  description: string
  function: string
  origin: string
  ownerId: string | null // Current owner (Character ID)
  locationId: string | null // Current location
  significance: ItemSignificance
  rules: string[] // What it can/cannot do
  visualReferences: string[]
  scale: string
  materialNotes: string
  ownershipHistory: OwnershipRecord[]
  createdAt: string
  updatedAt: string
}

export interface ItemsData {
  items: Item[]
}
