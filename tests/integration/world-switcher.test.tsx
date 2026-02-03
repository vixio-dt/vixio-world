import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WorldSwitcher } from '@/components/shell/WorldSwitcher'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 'world-1', name: 'Test World 1', created_at: '2024-01-01' },
            { id: 'world-2', name: 'Test World 2', created_at: '2024-01-02' },
          ],
          error: null,
        }),
      }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
  }),
}))

// Mock world-context
vi.mock('@/lib/utils/world-context', () => ({
  setCurrentWorldId: vi.fn(),
  getCurrentWorldId: vi.fn().mockReturnValue('world-1'),
  clearCurrentWorldId: vi.fn(),
}))

describe('WorldSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    render(<WorldSwitcher />)
    
    // Should show loading skeleton
    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })

  it('displays current world name after loading', async () => {
    render(<WorldSwitcher />)
    
    await waitFor(() => {
      expect(screen.getByText('Test World 1')).toBeInTheDocument()
    })
  })

  it('opens dropdown when clicked', async () => {
    render(<WorldSwitcher />)
    
    await waitFor(() => {
      expect(screen.getByText('Test World 1')).toBeInTheDocument()
    })
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Test World 2')).toBeInTheDocument()
    })
  })

  it('shows create new world option in dropdown', async () => {
    render(<WorldSwitcher />)
    
    await waitFor(() => {
      expect(screen.getByText('Test World 1')).toBeInTheDocument()
    })
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Create new world')).toBeInTheDocument()
    })
  })
})
