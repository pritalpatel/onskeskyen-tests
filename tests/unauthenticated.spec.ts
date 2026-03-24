/**
 * unauthenticated.spec.ts
 * ────────────────────────
 * Tests for public-facing pages that require NO login.
 * Runs under the 'chromium-public' project (no storageState dependency).
 *
 * Covers:
 *  1. Homepage loads with correct title and key elements
 *  2. Visual snapshot of the homepage hero section
 *  3. Login page renders correctly and shows validation on bad credentials
 */

import { test, expect } from '../fixtures';

test.describe('Public pages', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  // ── Test 1a: Homepage basics ────────────────────────────────────────────

  test('homepage loads with correct title and navigation', async ({ homePage }) => {
    // Title should mention Ønskeskyen
    const title = await homePage.getPageTitle();
    expect(title.toLowerCase()).toContain('ønskeskyen');

    // Logo / brand is visible
    await expect(homePage.navLogo).toBeVisible();

    // Login / Sign up links present in nav
    await expect(homePage.navLoginLink).toBeVisible();
  });

  // ── Test 1b: Homepage visual snapshot ──────────────────────────────────

  test('homepage hero section matches visual baseline', async ({ homePage, page }) => {
    // Capture full-page screenshot and compare to stored baseline.
    // On first run this CREATES the baseline — subsequent runs diff against it.
    await homePage.assertPageSnapshot('homepage-full');
  });

  // ── Test 1c: Login page validation ─────────────────────────────────────

  test('login page shows error on invalid credentials', async ({ loginPage }) => {
    await loginPage.open();

    await loginPage.login('not-a-real-user@invalid.com', 'wrongpassword');

    // An error message should appear
    await loginPage.expectLoginError();

    // Should still be on the login page
    await expect(loginPage.page).toHaveURL(/login/);

    // Visual snapshot of the error state
    // await loginPage.assertPageSnapshot('login-page-error-state');
  });
});
