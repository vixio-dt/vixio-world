'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { nprogress } from '@mantine/nprogress'

function RouterTransitionInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Complete progress bar when route finishes loading
    nprogress.complete()
  }, [pathname, searchParams])

  // Intercept link clicks to start progress
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      
      if (anchor) {
        const href = anchor.getAttribute('href')
        // Only start progress for internal navigation
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          nprogress.start()
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}

export function RouterTransition() {
  return (
    <Suspense fallback={null}>
      <RouterTransitionInner />
    </Suspense>
  )
}
