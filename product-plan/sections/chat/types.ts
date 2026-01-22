/**
 * Chat section types
 */

export type MessageRole = 'user' | 'assistant' | 'system'

export type CommandType = 'query' | 'check' | 'suggest' | 'gaps' | 'connections' | 'status'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  command?: CommandType
  metadata?: {
    sources?: Array<{
      type: string
      id: string
      name: string
    }>
    suggestions?: StorySuggestion[]
    consistencyResult?: ConsistencyResult
    gaps?: GapItem[]
  }
}

export interface ConsistencyResult {
  statement: string
  verdict: 'consistent' | 'warning' | 'conflict'
  applicableRules: Array<{
    ruleId: string
    ruleCode: string
    ruleName: string
    relevance: string
    conflict: boolean
  }>
  explanation: string
}

export interface StorySuggestion {
  title: string
  logline: string
  characters: Array<{ id: string; name: string; role: string }>
  locations: Array<{ id: string; name: string }>
  themes: string[]
  conflicts: string[]
}

export interface GapItem {
  type: 'character' | 'location' | 'organization' | 'rule' | 'story'
  description: string
  severity: 'high' | 'medium' | 'low'
  suggestion: string
}

export interface ChatSession {
  id: string
  worldId: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}
