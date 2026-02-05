'use client'

import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Tooltip label={computedColorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
      <ActionIcon
        onClick={toggleColorScheme}
        variant="subtle"
        color="gray"
        size="lg"
        radius="md"
        aria-label="Toggle color scheme"
      >
        {computedColorScheme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </ActionIcon>
    </Tooltip>
  )
}
