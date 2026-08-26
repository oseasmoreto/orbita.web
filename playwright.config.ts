import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  fullyParallel: true,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './e2e',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:5173',
  },
})
