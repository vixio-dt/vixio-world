import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { DashboardShell } from '@/components/shell/DashboardShell'

vi.mock('next/image', () => ({
  default: ({ priority, alt = '', ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />
  },
}))

vi.mock('@/lib/actions/auth', () => ({
  logout: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    }),
  }),
}))

vi.mock('@/lib/utils/world-context', () => ({
  setCurrentWorldId: vi.fn(),
  getCurrentWorldId: vi.fn().mockReturnValue(null),
  clearCurrentWorldId: vi.fn(),
}))

describe('dark mode disabled', () => {
  it('locks Mantine to light mode globally', async () => {
    const mantineProviderSpy = vi.fn()

    vi.resetModules()
    vi.doMock('@mantine/core', async () => {
      const actual = await vi.importActual<typeof import('@mantine/core')>('@mantine/core')

      return {
        ...actual,
        MantineProvider: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
          mantineProviderSpy(props)
          return <div data-testid="mantine-provider">{children}</div>
        },
      }
    })

    vi.doMock('@mantine/notifications', () => ({
      Notifications: () => null,
    }))

    const { MantineClientProvider } = await import('@/components/providers/MantineClientProvider')

    render(
      <MantineClientProvider>
        <div>content</div>
      </MantineClientProvider>
    )

    expect(mantineProviderSpy).toHaveBeenCalled()
    expect(mantineProviderSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        forceColorScheme: 'light',
      })
    )

    vi.doUnmock('@mantine/core')
    vi.doUnmock('@mantine/notifications')
  })

  it('does not render a color scheme toggle in the dashboard shell', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    })

    render(
      <MantineProvider forceColorScheme="light">
        <DashboardShell userEmail="hello@example.com">
          <div>Child content</div>
        </DashboardShell>
      </MantineProvider>
    )

    await screen.findByRole('button', { name: /start a project/i })
    expect(screen.queryByLabelText(/toggle color scheme/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/logout/i)).toBeInTheDocument()
  })
})
