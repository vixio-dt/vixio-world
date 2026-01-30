'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  action: () => void
  description: string
}

/**
 * Hook to register keyboard shortcuts.
 * Shortcuts are disabled when typing in input/textarea elements.
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true
        const metaMatch = shortcut.meta ? e.metaKey : true
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && metaMatch && shiftMatch && keyMatch) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

/**
 * Hook for common navigation shortcuts.
 */
export function useNavigationShortcuts() {
  const router = useRouter()

  useKeyboardShortcuts([
    {
      key: 'g',
      ctrl: true,
      action: () => router.push('/graph'),
      description: 'Go to graph view',
    },
    {
      key: 'e',
      ctrl: true,
      action: () => router.push('/export'),
      description: 'Go to export',
    },
    {
      key: 'n',
      ctrl: true,
      shift: true,
      action: () => {
        // Open new entity modal (future enhancement)
        console.log('New entity shortcut triggered')
      },
      description: 'New entity',
    },
  ])
}
