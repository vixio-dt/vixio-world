import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  // Note: These tests require authentication
  // In CI, you'd set up test credentials via environment variables
  
  test('dashboard shows entity cards', async ({ page }) => {
    // This will redirect to login if not authenticated
    await page.goto('/dashboard')
    
    // If we get redirected to login, the test environment isn't authenticated
    const url = page.url()
    if (url.includes('/login')) {
      test.skip()
      return
    }
    
    // Check for entity cards
    await expect(page.locator('text=Characters')).toBeVisible()
    await expect(page.locator('text=Locations')).toBeVisible()
    await expect(page.locator('text=Organizations')).toBeVisible()
  })

  test('sidebar navigation links work', async ({ page }) => {
    await page.goto('/dashboard')
    
    const url = page.url()
    if (url.includes('/login')) {
      test.skip()
      return
    }
    
    // Test navigation
    await page.click('a[href="/characters"]')
    await expect(page).toHaveURL(/.*characters/)
  })

  test('logout button is visible', async ({ page }) => {
    await page.goto('/dashboard')
    
    const url = page.url()
    if (url.includes('/login')) {
      test.skip()
      return
    }
    
    await expect(page.locator('button:has-text("Logout")')).toBeVisible()
  })
})

test.describe('Navigation Guards', () => {
  test('protected routes redirect to login', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies()
    
    // Try to access protected route
    await page.goto('/characters')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
  })

  test('characters page requires authentication', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/characters')
    await expect(page).toHaveURL(/.*login/)
  })

  test('locations page requires authentication', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/locations')
    await expect(page).toHaveURL(/.*login/)
  })
})
