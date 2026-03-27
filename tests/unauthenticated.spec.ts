/**
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

  test('homepage loads with correct title and navigation', async ({ homePage }) => {
    const title = await homePage.getPageTitle();
    expect(title.toLowerCase()).toContain('ønskeskyen');

    await expect(homePage.navLogo).toBeVisible();

    await expect(homePage.navLoginLink).toBeVisible();
  });

  test('homepage hero section matches visual baseline', async ({ homePage, page }) => {
    await homePage.assertPageSnapshot('homepage-full');
  });

  test('login page shows error on invalid credentials', async ({ loginPage }) => {
    await loginPage.open();

    await loginPage.login('not-a-real-user@invalid.com', 'wrongpassword');

    await loginPage.expectLoginError();

    await expect(loginPage.page).toHaveURL(/login/);

    // @TODO: Disabled temporary due to false postive error
    // await loginPage.assertPageSnapshot('login-page-error-state');
  });
});
