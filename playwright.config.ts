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

  /* Run tests in parallel */
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: 'https://onskeskyen.dk',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Snapshot / visual comparison settings */
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05, // allow 5% pixel diff
      animations: 'disabled',
    },
  },

  /* Visual snapshot directory */
  snapshotDir: './screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  projects: [
    // ── Auth setup (runs once, not in parallel) ──────────────────────────────
    {
      name: 'auth-setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // ── Authenticated desktop tests ──────────────────────────────────────────
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['auth-setup'],
      testIgnore: ['**/auth.setup.ts', '**/unauthenticated.spec.ts'],
    },

    // ── Unauthenticated / public tests ───────────────────────────────────────
    {
      name: 'chromium-public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/unauthenticated.spec.ts'],
    },

    // ── Mobile smoke test ────────────────────────────────────────────────────
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
