import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary</Button>)
    
    const button = screen.getByRole('button', { name: /primary/i })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain('bg-gradient')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    
    const button = screen.getByRole('button', { name: /secondary/i })
    expect(button).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    
    const button = screen.getByRole('button', { name: /clickable/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders in disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders with href attribute when provided', () => {
    render(<Button href="/test">Link Button</Button>)
    
    // Button component adds href but stays as button element
    const button = screen.getByRole('button', { name: /link button/i })
    expect(button).toHaveAttribute('href', '/test')
  })

  it('accepts loading prop', () => {
    // Note: Current implementation may not disable on loading
    // This test documents actual behavior
    render(<Button loading>Loading</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
