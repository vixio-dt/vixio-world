/**
 * Organization types for Vixio Worldbuilder
 */

export type OrganizationType = 
  | 'government'
  | 'religion'
  | 'corporation'
  | 'guild'
  | 'family'
  | 'military'
  | 'secret_society'

export type OrganizationStatus = 'active' | 'disbanded' | 'dormant'

export interface OrganizationLeadership {
  title: string
  holder: string | null // Character ID or null if unknown/vacant
}

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  purpose: string
  structure: string
  leadership: OrganizationLeadership
  members: string[] // Character IDs
  memberCount: number
  territory: string[] // Location IDs
  resources: string[]
  beliefs: string
  symbols: string
  allies: string[] // Organization IDs
  enemies: string[] // Organization IDs
  history: string
  founded: string
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

export interface OrganizationsData {
  organizations: Organization[]
}
