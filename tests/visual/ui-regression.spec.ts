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

// Specific test: verify no dark backgrounds on Mantine components
test('no dark mode leak on form page', async ({ page }) => {
  await page.goto('/characters/new')
  await page.waitForLoadState('networkidle')
  
  // Check that Paper (Card) background is white/light
  const paper = page.locator('.mantine-Paper-root').first()
  const bgColor = await paper.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  
  // rgb(255, 255, 255) = white, or close to white
  expect(bgColor).toMatch(/rgb\(2[45]\d, 2[45]\d, 2[45]\d\)|rgb\(255, 255, 255\)/)
})

// Specific test: verify form inputs are light
test('form inputs have light background', async ({ page }) => {
  await page.goto('/characters/new')
  await page.waitForLoadState('networkidle')
  
  const input = page.locator('.mantine-TextInput-input').first()
  const bgColor = await input.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  
  // Should be white or near-white
  expect(bgColor).toMatch(/rgb\(2[45]\d, 2[45]\d, 2[45]\d\)|rgb\(255, 255, 255\)/)
})
