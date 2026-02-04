import type { TaskComplexity } from '../state/types.js'

interface ComplexityResult {
  complexity: TaskComplexity
  reasoning: string
  estimatedFiles: number
}

// Keywords that suggest more complex work
const COMPLEX_KEYWORDS = [
  'page', 'feature', 'system', 'component', 'flow',
  'authentication', 'integration', 'api', 'database',
  'crud', 'form', 'wizard', 'dashboard'
]

const QUICK_KEYWORDS = [
  'fix', 'typo', 'color', 'text', 'label', 'rename',
  'update', 'change', 'adjust', 'tweak', 'remove'
]

export function assessComplexity(description: string): ComplexityResult {
  const lower = description.toLowerCase()
  
  // Count keyword matches
  const complexMatches = COMPLEX_KEYWORDS.filter(k => lower.includes(k)).length
  const quickMatches = QUICK_KEYWORDS.filter(k => lower.includes(k)).length
  
  // Quick if more quick keywords and no complex keywords
  if (quickMatches > 0 && complexMatches === 0) {
    return {
      complexity: 'quick',
      reasoning: 'Simple modification task',
      estimatedFiles: 1 + quickMatches,
    }
  }
  
  // Default to standard for anything non-trivial
  return {
    complexity: 'standard',
    reasoning: complexMatches > 0 
      ? `Contains feature keywords: ${COMPLEX_KEYWORDS.filter(k => lower.includes(k)).join(', ')}`
      : 'Default to standard for new work',
    estimatedFiles: 3 + complexMatches * 2,
  }
}
