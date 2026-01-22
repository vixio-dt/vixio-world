/**
 * Stories section types
 */

export type StoryStatus = 'concept' | 'outline' | 'draft' | 'complete'

export type ShotType = 
  | 'wide' 
  | 'medium' 
  | 'close_up' 
  | 'extreme_close_up' 
  | 'over_shoulder' 
  | 'pov' 
  | 'aerial'
  | 'two_shot'

export type CameraMovement = 
  | 'static' 
  | 'pan' 
  | 'tilt' 
  | 'dolly' 
  | 'crane' 
  | 'handheld' 
  | 'steadicam'
  | 'slow dolly'

export interface Story {
  id: string
  title: string
  logline: string
  genre: string
  tone: string
  theme: string
  status: StoryStatus
  protagonist_ids: string[]
  antagonist_ids: string[]
  featured_character_ids: string[]
  setting_ids: string[]
  created_at?: string
  updated_at?: string
}

export interface Scene {
  id: string
  story_id: string
  scene_number: number
  location_id: string
  time: string
  purpose: string
  summary: string
  emotional_beat: string
  key_dialogue: string[]
  action: string
  props_needed: string[]
  character_ids: string[]
  created_at?: string
  updated_at?: string
}

export interface Shot {
  id: string
  scene_id: string
  shot_number: number
  shot_type: ShotType
  camera_movement: CameraMovement
  description: string
  action: string
  dialogue: string | null
  mood: string
  lighting_notes: string
  duration_estimate: number
  visual_prompt: string
  character_ids: string[]
  created_at?: string
  updated_at?: string
}

export interface StoryWithScenes extends Story {
  scenes: Array<Scene & { shots: Shot[] }>
  scene_count: number
  shot_count: number
}

export interface StoriesData {
  stories: Story[]
  scenes: Scene[]
  shots: Shot[]
}
