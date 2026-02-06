import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config specifically for visual regression tests.
 * Run with: npx playwright test --config=tests/visual/playwright.config.ts
 * Update baselines: npx playwright test --config=tests/visual/playwright.config.ts --update-snapshots
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Sequential for consistent screenshots
  reporter: [['list']],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    colorScheme: 'light', // Force light mode in browser
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
