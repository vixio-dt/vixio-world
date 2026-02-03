import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
  })

  test('should display login form with required fields', async ({ page }) => {
    await page.goto('/login')
    
    // Check for email and password inputs
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should display signup form with required fields', async ({ page }) => {
    await page.goto('/signup')
    
    // Check for email and password inputs
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Should show an error message (not redirect to dashboard)
    await page.waitForTimeout(2000) // Wait for auth attempt
    await expect(page).toHaveURL(/.*login/)
  })

  test('landing page should have login and signup links', async ({ page }) => {
    await page.goto('/')
    
    // Check for auth links
    await expect(page.locator('a[href="/login"]')).toBeVisible()
    await expect(page.locator('a[href="/signup"]')).toBeVisible()
  })
})
