import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { WorldOnboarding } from '@/components/shell/WorldOnboarding'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'world-123', name: 'Dream Architect' },
            error: null,
          }),
        }),
      }),
    }),
  }),
}))

vi.mock('@/lib/utils/world-context', () => ({
  setCurrentWorldId: vi.fn(),
}))

vi.mock('@/lib/actions/seed-template', () => ({
  createTemplateWorld: vi.fn().mockResolvedValue({
    success: true,
    worldId: 'demo-project',
  }),
}))

describe('WorldOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('presents workflow-first onboarding options', () => {
    render(
      <WorldOnboarding
        isOpen
        onClose={vi.fn()}
        onWorldCreated={vi.fn()}
      />
    )

    expect(screen.getByText('Start from project brief')).toBeInTheDocument()
    expect(screen.getByText('Start from script breakdown')).toBeInTheDocument()
    expect(screen.getByText('Import existing references')).toBeInTheDocument()
    expect(screen.getByText('Explore demo project')).toBeInTheDocument()
  })

  it('switches to project creation when project brief is selected', () => {
    render(
      <WorldOnboarding
        isOpen
        onClose={vi.fn()}
        onWorldCreated={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /start from project brief/i }))

    expect(screen.getByText('Create New Project')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/dream architect/i)).toBeInTheDocument()
  })
})
