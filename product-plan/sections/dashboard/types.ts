/**
 * Dashboard section types
 */

export interface WorldSummary {
  id: string
  name: string
  genre: string
  tone: string
  themes: string[]
  logline: string
}

export interface WorldStats {
  characters: number
  locations: number
  organizations: number
  events: number
  items: number
  rules: number
  stories: number
  scenes: number
  shots: number
}

export type WarningSeverity = 'blocker' | 'warning' | 'note'
export type WarningType = 'conflict' | 'gap' | 'incomplete'
export type ElementType = 
  | 'character' 
  | 'location' 
  | 'organization' 
  | 'event' 
  | 'item' 
  | 'rule' 
  | 'story' 
  | 'scene' 
  | 'shot'

export interface ConsistencyWarning {
  id: string
  type: WarningType
  severity: WarningSeverity
  message: string
  element_type: ElementType
  element_id: string
  element_name: string
}

export type ActivityAction = 'created' | 'updated' | 'deleted'

export interface ActivityItem {
  id: string
  action: ActivityAction
  element_type: ElementType
  element_id: string
  element_name: string
  timestamp: string
}

export interface DashboardData {
  world: WorldSummary
  stats: WorldStats
  warnings: ConsistencyWarning[]
  recentActivity: ActivityItem[]
}
