/**
 * Locations section types
 */

export type LocationType = 
  | 'world' 
  | 'continent' 
  | 'country' 
  | 'region' 
  | 'city' 
  | 'district' 
  | 'building' 
  | 'room' 
  | 'landmark' 
  | 'natural'

export type CharacterLocationType = 'resident' | 'birthplace' | 'workplace' | 'frequents'

export interface Location {
  id: string
  parent_location_id: string | null
  name: string
  type: LocationType
  description: string
  atmosphere: string
  climate: string
  key_features: string[]
  history: string
  cultural_significance: string
  visual_references: string
  lighting_notes: string
  sound_notes: string
  asset_requirements: string[]
  created_at?: string
  updated_at?: string
}

export interface LocationTreeNode extends Location {
  children: LocationTreeNode[]
  depth: number
}

export interface CharacterLocation {
  character_id: string
  character_name?: string
  location_id: string
  type: CharacterLocationType
}

export interface LocationWithRelations extends Location {
  parent?: Pick<Location, 'id' | 'name' | 'type'>
  children: Pick<Location, 'id' | 'name' | 'type'>[]
  inhabitants: Array<CharacterLocation & { character_name: string }>
}

export interface LocationsData {
  locations: Location[]
  character_locations: CharacterLocation[]
}

export type LocationViewMode = 'tree' | 'list'
