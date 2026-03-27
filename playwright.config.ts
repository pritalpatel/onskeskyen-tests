import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright configuration for onskeskyen.dk test suite.
 * - Parallel execution across multiple workers
 * - Screenshot comparison support
 * - Authenticated state reuse via storageState
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://onskeskyen.dk',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    toHaveScreenshot: {
      // @TODO: Figure out max diff pixel ratio to avoid existing false positive tests with screenshot comparison
      maxDiffPixelRatio: 0.05, // allow 5% pixel diff
      animations: 'disabled',
    },
  },

  snapshotDir: './screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  projects: [
    {
      name: 'auth-setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['auth-setup'],
      testIgnore: ['**/auth.setup.ts', '**/unauthenticated.spec.ts'],
    },

    {
      name: 'chromium-public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/unauthenticated.spec.ts'],
    },

    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        storageState: '.auth/user.json',
      },
      dependencies: ['auth-setup'],
      testIgnore: ['**/auth.setup.ts', '**/unauthenticated.spec.ts'],
    },
  ],
});
