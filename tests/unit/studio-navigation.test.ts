import { describe, expect, it } from 'vitest'
import { primaryNavItems, utilityNavItems } from '@/components/shell/navigation'

describe('studio navigation config', () => {
  it('exposes workflow-first primary navigation', () => {
    expect(primaryNavItems.map((item) => item.label)).toEqual([
      'Overview',
      'Boards',
      'Canon',
      'Assets',
    ])

    expect(primaryNavItems.map((item) => item.href)).toEqual([
      '/dashboard',
      '/boards',
      '/canon',
      '/assets',
    ])
  })

  it('keeps exports and agent chat in utility navigation', () => {
    expect(utilityNavItems.map((item) => item.label)).toEqual([
      'Agent Chat',
      'Exports',
    ])

    expect(utilityNavItems.map((item) => item.href)).toEqual([
      '/chat',
      '/export',
    ])
  })
})
