/**
 * Characters section types
 */

export type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'background'

export type RelationshipType = 
  | 'ally' 
  | 'enemy' 
  | 'family' 
  | 'romantic' 
  | 'mentor' 
  | 'rival' 
  | 'acquaintance'

export type MembershipStatus = 'current' | 'former' | 'founding'

export type LocationRelationType = 'resident' | 'birthplace' | 'workplace' | 'frequents'

export interface Character {
  id: string
  name: string
  aliases: string[]
  role: CharacterRole
  species: string
  appearance: string
  personality: string
  background: string
  motivations: string
  arc_potential: string
  visual_references: string
  voice_notes: string
  movement_notes: string
  quote?: string
  created_at?: string
  updated_at?: string
}

export interface CharacterRelationship {
  character_a_id: string
  character_b_id: string
  type: RelationshipType
  description: string
}

export interface CharacterOrganization {
  character_id: string
  organization_id: string
  organization_name?: string
  role: string
  status: MembershipStatus
}

export interface CharacterLocation {
  character_id: string
  location_id: string
  location_name?: string
  type: LocationRelationType
}

export interface CharacterWithRelations extends Character {
  relationships: Array<CharacterRelationship & { 
    related_character: Pick<Character, 'id' | 'name' | 'role'> 
  }>
  organizations: CharacterOrganization[]
  locations: CharacterLocation[]
}

export interface CharacterListFilters {
  search: string
  role: CharacterRole | 'all'
  species: string | 'all'
  organization: string | 'all'
}

export interface CharactersData {
  characters: Character[]
  relationships: CharacterRelationship[]
}
