'use client'

import { useState, useEffect } from 'react'
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  // This is intentional - we need to delay hydration-sensitive content
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
  }

  // Show consistent icon during SSR and initial hydration
  const isDark = mounted ? computedColorScheme === 'dark' : false
  const Icon = isDark ? Sun : Moon
  const label = isDark ? 'Light mode' : 'Dark mode'

  return (
    <Tooltip label={label}>
      <ActionIcon
        onClick={toggleColorScheme}
        variant="subtle"
        color="gray"
        size="lg"
        radius="md"
        aria-label="Toggle color scheme"
      >
        <Icon className="w-5 h-5" />
      </ActionIcon>
    </Tooltip>
  )
}
