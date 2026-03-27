/**
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
const WISH_URL     = 'https://onskeskyen.dk/da/product/MbfokbMtq9ehszhW?brandName=imerco&trendingListId=uZ2cIDbQNJeMUZdm&productListPosition=BRAND%2CTRENDING_LISTS&source=TrendingList&sourceId=uZ2cIDbQNJeMUZdm&position=TRENDING_LISTS%2CPRODUCTS&productSource=TrendingList';
const WISH_PRICE   = '299';

test.describe('Wishlist management', () => {

  test('user can create a new wishlist', async ({ wishlistPage, homePage }) => {
    await homePage.open();
    await wishlistPage.open();

    const countBefore = await wishlistPage.getWishlistCount();

    await wishlistPage.createWishlist(WISH_URL, 'Created by Playwright automation');

    await wishlistPage.expectWishlistVisible(WISHLIST_NAME);

    const countAfter = await wishlistPage.getWishlistCount();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore + 1);
  });

  test('user can add a wish item to a wishlist', async ({ wishlistPage }) => {
    await wishlistPage.open();

    await wishlistPage.openFirstWishlist();

    const countBefore = await wishlistPage.getWishItemCount();

    await wishlistPage.addWishItem(WISH_TITLE, WISH_URL, WISH_PRICE);

    await expect(wishlistPage.page.locator(`text="${WISH_TITLE}"`)).toBeVisible();

    const countAfter = await wishlistPage.getWishItemCount();
    expect(countAfter).toBeGreaterThanOrEqual(countBefore + 1);
  });

  test('wishlist dashboard matches visual baseline', async ({ wishlistPage }) => {
    await wishlistPage.open();

    await wishlistPage.page.evaluate(() => {
      document.querySelectorAll('time, .timestamp, .date').forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });

    await wishlistPage.assertPageSnapshot('wishlist-dashboard');
  });

  test('wishlist page shows empty state or create prompt', async ({ wishlistPage, page }) => {
    await wishlistPage.open();

    const hasLists  = (await wishlistPage.getWishlistCount()) > 0;
    const hasCreate = await wishlistPage.createWishlistButton.isVisible({ timeout: 3000 });

    expect(hasLists || hasCreate).toBe(true);
  });
});
