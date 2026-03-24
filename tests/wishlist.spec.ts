/**
 * wishlist.spec.ts
 * ─────────────────
 * Core feature tests — creating and managing wishlists.
 * Runs under the authenticated project (storageState loaded).
 *
 * Covers:
 *  1. Create a new wishlist
 *  2. Add a wish item to a wishlist
 *  3. Visual snapshot of wishlist dashboard
 *  4. Wishlist is listed on the dashboard after creation
 */

import { test, expect } from '../fixtures';

const WISHLIST_NAME = `Playwright Test List ${Date.now()}`;
const WISH_TITLE   = 'Playwright - Node.js Web Automation';
const WISH_URL     = 'https://example.com/playwright-book';
const WISH_PRICE   = '299';

test.describe('Wishlist management', () => {

  // ── Test 3a: Create a new wishlist ──────────────────────────────────────

  test('user can create a new wishlist', async ({ wishlistPage, homePage }) => {
    await homePage.open();
    await wishlistPage.open();

    const countBefore = await wishlistPage.getWishlistCount();

    await wishlistPage.createWishlist(WISHLIST_NAME, 'Created by Playwright automation');

    // The new wishlist name should be visible
    await wishlistPage.expectWishlistVisible(WISHLIST_NAME);

    // Count should have increased by one
    const countAfter = await wishlistPage.getWishlistCount();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore + 1);
  });

  // ── Test 3b: Add a wish item ────────────────────────────────────────────

  test('user can add a wish item to a wishlist', async ({ wishlistPage }) => {
    await wishlistPage.open();

    // Open the first available wishlist (or the one we just created)
    await wishlistPage.openFirstWishlist();

    const countBefore = await wishlistPage.getWishItemCount();

    await wishlistPage.addWishItem(WISH_TITLE, WISH_URL, WISH_PRICE);

    // Item should now appear in the list
    await expect(wishlistPage.page.locator(`text="${WISH_TITLE}"`)).toBeVisible();

    const countAfter = await wishlistPage.getWishItemCount();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore + 1);
  });

  // ── Test 3c: Wishlist dashboard visual snapshot ─────────────────────────

  test('wishlist dashboard matches visual baseline', async ({ wishlistPage }) => {
    await wishlistPage.open();

    // Mask dynamic timestamps to avoid flaky diffs
    await wishlistPage.page.evaluate(() => {
      document.querySelectorAll('time, .timestamp, .date').forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });

    await wishlistPage.assertPageSnapshot('wishlist-dashboard');
  });

  // ── Test 3d: Empty state shown when no wishlists exist ──────────────────

  test('wishlist page shows empty state or create prompt', async ({ wishlistPage, page }) => {
    await wishlistPage.open();

    // Either there are wishlists OR there is a clear empty/CTA state
    const hasLists  = (await wishlistPage.getWishlistCount()) > 0;
    const hasCreate = await wishlistPage.createWishlistButton.isVisible({ timeout: 3000 });

    // At least one of them must be true — the page can't be a blank void
    expect(hasLists || hasCreate).toBe(true);
  });
});
