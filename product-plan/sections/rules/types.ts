/**
 * Rules section types
 */

export type RuleCategory = 
  | 'physics' 
  | 'magic' 
  | 'technology' 
  | 'biology' 
  | 'social' 
  | 'political' 
  | 'economic' 
  | 'temporal' 
  | 'cosmological'

export interface Rule {
  id: string
  code: string
  name: string
  category: RuleCategory
  statement: string
  scope: string
  exceptions: string[]
  consequences: string
  examples: string[]
  created_at?: string
  updated_at?: string
}

export interface RulesData {
  rules: Rule[]
}

export interface ConsistencyCheckResult {
  statement: string
  applicableRules: Array<{
    rule: Rule
    relevance: 'direct' | 'related'
    conflict: boolean
    explanation: string
  }>
  verdict: 'consistent' | 'warning' | 'conflict'
}
