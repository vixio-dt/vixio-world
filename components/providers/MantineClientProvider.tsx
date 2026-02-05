'use client'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { NavigationProgress } from '@mantine/nprogress'
import { RouterTransition } from './RouterTransition'
import { theme } from '@/lib/theme/mantine-theme'

export function MantineClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <NavigationProgress color="cyan" size={3} />
      <RouterTransition />
      <Notifications position="bottom-right" />
      {children}
    </MantineProvider>
  )
}
