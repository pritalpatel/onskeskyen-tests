/**
 * authentication.spec.ts
 * ───────────────────────
 * Tests for sign-up, login, and logout flows.
 * Uses the authenticated fixture project — storageState is loaded.
 *
 * Covers:
 *  1. Successful logout
 *  2. Signup form validation (duplicate email, weak password)
 *  3. Visual comparison of the authenticated dashboard/home state
 */

import { test, expect } from '../fixtures';

const UNIQUE_EMAIL = `test+${Date.now()}@mailinator.com`;

test.describe('Authentication flows', () => {

  // ── Test 2a: Authenticated user can log out ─────────────────────────────

  test('authenticated user can log out successfully', async ({ profilePage, page }) => {
    await profilePage.open();

    const wasLoggedIn = await profilePage.isLoggedIn();
    expect(wasLoggedIn).toBe(true);

    await profilePage.logout();

    // After logout, should land on homepage or login
    await expect(page).toHaveURL('/da/');

    // User menu / avatar should no longer be visible
    await expect(
      page.getByTestId('navbarUserProfileAvatar')
    ).not.toBeVisible();
  });

  // ── Test 2b: Signup form validates duplicate email ───────────────────────

  test('signup form rejects already-registered email', async ({ signupPage, profilePage }) => {
    await profilePage.open();
    await profilePage.logout();
    await signupPage.openForm();

    // Use the known test-account email (which already exists)
    const existingEmail = process.env.TEST_USER_EMAIL ?? 'test@example.com';
    await signupPage.fillForm('Duplicate User', existingEmail, process.env.TEST_USER_PASSWORD ?? '');
    await signupPage.submit();

    // Should show an error (email taken / already registered)
    await signupPage.expectValidationError();
  });

  // TODO: Signup test
});
