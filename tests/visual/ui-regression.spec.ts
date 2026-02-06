import { test, expect } from '@playwright/test'

/**
 * Visual regression tests for Vixio Worldbuilder.
 * 
 * These tests screenshot key pages and compare against baselines.
 * Run `npx playwright test tests/visual/ --update-snapshots` to update baselines.
 * 
 * Catches:
 * - Dark mode leaks (Mantine/Tailwind CSS conflicts)
 * - Broken layouts or missing styles
 * - Component rendering regressions
 */

const pages = [
  { path: '/dashboard', name: 'dashboard' },
  { path: '/characters', name: 'characters-list' },
  { path: '/characters/new', name: 'characters-form' },
  { path: '/locations', name: 'locations-list' },
  { path: '/timeline', name: 'timeline-list' },
]

for (const page of pages) {
  test(`visual: ${page.name} renders correctly`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path)
    
    // Wait for content to load (Mantine components hydrate)
    await browserPage.waitForLoadState('networkidle')
    
    // Screenshot comparison with 1% tolerance
    await expect(browserPage).toHaveScreenshot(`${page.name}.png`, {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    })
  })
}

// Specific test: verify no dark backgrounds even when OS prefers dark
test('no dark mode leak on form page (light OS)', async ({ page }) => {
  await page.goto('/characters/new')
  await page.waitForLoadState('networkidle')
  
  const paper = page.locator('.mantine-Paper-root').first()
  const bgColor = await paper.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  
  expect(bgColor).toMatch(/rgb\(2[45]\d, 2[45]\d, 2[45]\d\)|rgb\(255, 255, 255\)/)
})

// CRITICAL: Test with dark OS preference to catch the exact bug users hit
test('no dark mode leak on form page (dark OS)', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  
  await page.goto('/characters/new')
  await page.waitForLoadState('networkidle')
  
  const paper = page.locator('.mantine-Paper-root').first()
  const bgColor = await paper.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  
  // Even with dark OS preference, Paper must be white (forceColorScheme="light")
  expect(bgColor).toMatch(/rgb\(2[45]\d, 2[45]\d, 2[45]\d\)|rgb\(255, 255, 255\)/)
  await context.close()
})

// Test dashboard cards are light with dark OS preference
test('dashboard cards light with dark OS', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')
  
  await expect(page).toHaveScreenshot('dashboard-dark-os.png', {
    maxDiffPixelRatio: 0.01,
    fullPage: false,
  })
  await context.close()
})
