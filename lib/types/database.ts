// Database types for Vixio Worldbuilder
// Based on supabase/schema.sql

// Content block for freeform content in entities
export type ContentBlock = {
  id: string;
  type: 'text' | 'media';
  content: string;
  mentions: string[];
  order: number;
  created_at: string;
  updated_at: string;
};

// Entity types for @mentions
export type EntityType = 'character' | 'location' | 'organization' | 'event' | 'item' | 'rule' | 'story';

// Entity mention for tracking @mentions in content
export type EntityMention = {
  id: string;
  source_entity_type: EntityType;
  source_entity_id: string;
  target_entity_type: EntityType;
  target_entity_id: string;
  context: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      worlds: {
        Row: World
        Insert: Omit<World, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<World, 'id'>>
      }
      characters: {
        Row: Character
        Insert: Omit<Character, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Character, 'id'>>
      }
      locations: {
        Row: Location
        Insert: Omit<Location, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Location, 'id'>>
      }
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Organization, 'id'>>
      }
      events: {
        Row: WorldEvent
        Insert: Omit<WorldEvent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorldEvent, 'id'>>
      }
      items: {
        Row: Item
        Insert: Omit<Item, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Item, 'id'>>
      }
      rules: {
        Row: Rule
        Insert: Omit<Rule, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Rule, 'id'>>
      }
      stories: {
        Row: Story
        Insert: Omit<Story, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Story, 'id'>>
      }
      scenes: {
        Row: Scene
        Insert: Omit<Scene, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Scene, 'id'>>
      }
      shots: {
        Row: Shot
        Insert: Omit<Shot, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Shot, 'id'>>
      }
      // Junction tables
      character_relationships: {
        Row: CharacterRelationship
        Insert: CharacterRelationship
        Update: Partial<CharacterRelationship>
      }
      character_organizations: {
        Row: CharacterOrganization
        Insert: CharacterOrganization
        Update: Partial<CharacterOrganization>
      }
      character_locations: {
        Row: CharacterLocation
        Insert: CharacterLocation
        Update: Partial<CharacterLocation>
      }
      event_characters: {
        Row: EventCharacter
        Insert: EventCharacter
        Update: Partial<EventCharacter>
      }
      scene_characters: {
        Row: SceneCharacter
        Insert: SceneCharacter
        Update: Partial<SceneCharacter>
      }
      shot_characters: {
        Row: ShotCharacter
        Insert: ShotCharacter
        Update: Partial<ShotCharacter>
      }
      story_characters: {
        Row: StoryCharacter
        Insert: StoryCharacter
        Update: Partial<StoryCharacter>
      }
      item_owners: {
        Row: ItemOwner
        Insert: ItemOwner
        Update: Partial<ItemOwner>
      }
      entity_mentions: {
        Row: EntityMention
        Insert: Omit<EntityMention, 'id' | 'created_at'>
        Update: Partial<Omit<EntityMention, 'id'>>
      }
    }
  }
}

// Core Entities

export interface World {
  id: string
  user_id: string
  name: string
  genre: string | null
  tone: string | null
  themes: string[] | null
  logline: string | null
  created_at: string
  updated_at: string
}

export interface Character {
  id: string
  world_id: string
  name: string
  aliases: string[] | null
  role: 'protagonist' | 'antagonist' | 'supporting' | 'background' | null
  species: string | null
  appearance: string | null
  personality: string | null
  background: string | null
  motivations: string | null
  arc_potential: string | null
  visual_references: string | null
  voice_notes: string | null
  movement_notes: string | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  world_id: string
  parent_location_id: string | null
  name: string
  type: 'planet' | 'continent' | 'country' | 'city' | 'district' | 'building' | 'room' | null
  description: string | null
  atmosphere: string | null
  climate: string | null
  key_features: string | null
  history: string | null
  cultural_significance: string | null
  visual_references: string | null
  lighting_notes: string | null
  sound_notes: string | null
  asset_requirements: string | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  world_id: string
  name: string
  type: 'government' | 'religion' | 'corporation' | 'guild' | 'family' | 'military' | 'secret_society' | null
  purpose: string | null
  structure: string | null
  leadership: string | null
  territory: string | null
  resources: string | null
  beliefs: string | null
  symbols: string | null
  history: string | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface WorldEvent {
  id: string
  world_id: string
  location_id: string | null
  name: string
  date: string | null
  date_sort: number | null
  type: 'historical' | 'plot_point' | 'scheduled' | 'recurring' | null
  description: string | null
  causes: string | null
  consequences: string | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  world_id: string
  location_id: string | null
  name: string
  type: 'weapon' | 'vehicle' | 'artifact' | 'tool' | 'document' | 'clothing' | 'technology' | null
  description: string | null
  function: string | null
  origin: string | null
  significance: string | null
  rules: string | null
  visual_references: string | null
  scale: string | null
  material_notes: string | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface Rule {
  id: string
  world_id: string
  name: string
  code: string | null
  category: 'physics' | 'magic' | 'technology' | 'biology' | 'social' | 'political' | 'economic' | 'temporal' | 'cosmological' | null
  statement: string | null
  scope: string | null
  exceptions: string | null
  consequences: string | null
  examples: string | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  world_id: string
  title: string
  logline: string | null
  genre: string | null
  tone: string | null
  theme: string | null
  status: 'concept' | 'outline' | 'draft' | 'complete' | null
  story_context: string | null
  content_blocks: ContentBlock[]
  created_at: string
  updated_at: string
}

export interface Scene {
  id: string
  story_id: string
  location_id: string | null
  scene_number: number
  time: string | null
  purpose: string | null
  summary: string | null
  emotional_beat: string | null
  key_dialogue: string | null
  action: string | null
  props_needed: string | null
  setup_payoff: string | null
  created_at: string
  updated_at: string
}

export interface Shot {
  id: string
  scene_id: string
  shot_number: number
  shot_type: 'wide' | 'medium' | 'close_up' | 'extreme_close_up' | 'over_shoulder' | 'pov' | 'aerial' | null
  camera_movement: 'static' | 'pan' | 'tilt' | 'dolly' | 'crane' | 'handheld' | 'steadicam' | null
  description: string | null
  action: string | null
  dialogue: string | null
  mood: string | null
  lighting_notes: string | null
  duration_estimate: number | null
  visual_prompt: string | null
  created_at: string
  updated_at: string
}

// Junction Tables

export interface CharacterRelationship {
  character_a_id: string
  character_b_id: string
  relationship_type: 'ally' | 'enemy' | 'family' | 'romantic' | 'mentor' | 'rival' | 'friend' | 'colleague' | null
  description: string | null
}

export interface CharacterOrganization {
  character_id: string
  organization_id: string
  role: string | null
  status: 'current' | 'former' | 'founding' | null
}

export interface CharacterLocation {
  character_id: string
  location_id: string
  relationship_type: 'resident' | 'birthplace' | 'workplace' | 'frequent' | null
}

export interface EventCharacter {
  event_id: string
  character_id: string
  role: 'participant' | 'witness' | 'victim' | 'instigator' | null
}

export interface SceneCharacter {
  scene_id: string
  character_id: string
}

export interface ShotCharacter {
  shot_id: string
  character_id: string
}

export interface StoryCharacter {
  story_id: string
  character_id: string
  role: 'protagonist' | 'antagonist' | 'supporting' | null
}

export interface ItemOwner {
  item_id: string
  character_id: string
  ownership_type: 'current' | 'former' | 'creator' | null
}

// Utility types
export type Tables = Database['public']['Tables']
export type TableName = keyof Tables
