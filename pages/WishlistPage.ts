import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * WishlistPage — create, view, and manage wishlists.
 * This is the core feature of onskeskyen.dk.
 */
export class WishlistPage extends BasePage {
  readonly createWishlistButton: Locator;
  readonly wishlistNameInput: Locator;
  readonly wishlistDescriptionInput: Locator;
  readonly saveWishlistButton: Locator;
  readonly wishlistCards: Locator;
  readonly firstWishlistCard: Locator;
  readonly addWishButton: Locator;
  readonly wishTitleInput: Locator;
  readonly wishUrlInput: Locator;
  readonly wishPriceInput: Locator;
  readonly saveWishButton: Locator;
  readonly wishItems: Locator;
  readonly deleteWishlistButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly shareButton: Locator;
  readonly shareLink: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);

    this.createWishlistButton = page.getByTestId('new-wish-btn');
    this.wishlistNameInput = page.getByRole('textbox', { name: 'Indsæt produktlink' });
    this.wishlistDescriptionInput = page.locator('textarea[name="description"], input[name="description"]').first();
    this.saveWishlistButton = page.getByTestId('select-wishlist-list-item-0');
    this.wishlistCards = page.locator('[data-testid="wishlist-card"], .wishlist-card, .wishlist-item');
    this.firstWishlistCard = this.wishlistCards.first();

    this.addWishButton = page.locator('button:has-text("Tilføj ønske"), button:has-text("Nyt ønske"), [data-testid="add-wish"]').first();
    this.wishTitleInput = page.locator('input[name="title"], input[placeholder*="titel"], input[placeholder*="ønske"]').first();
    this.wishUrlInput = page.locator('input[name="url"], input[type="url"], input[placeholder*="link"], input[placeholder*="URL"]').first();
    this.wishPriceInput = page.locator('input[name="price"], input[placeholder*="pris"], input[placeholder*="Price"]').first();
    this.saveWishButton = page.locator('button[type="submit"]:has-text("Gem"), button:has-text("Tilføj"), button:has-text("Gem ønske")').first();
    this.wishItems = page.locator('[data-testid="wish-item"], .wish-item, .wish-card');

    this.deleteWishlistButton = page.locator('button:has-text("Slet"), [data-testid="delete-wishlist"]').first();
    this.confirmDeleteButton = page.locator('button:has-text("Bekræft"), button:has-text("Ja, slet"), [data-testid="confirm-delete"]').first();
    this.shareButton = page.locator('button:has-text("Del"), [data-testid="share"]').first();
    this.shareLink = page.locator('[data-testid="share-link"], input[readonly]').first();
    this.emptyState = page.locator('[data-testid="empty-state"], .empty-state, :has-text("Ingen ønskelister")').first();
  }

  async open() {
   await this.page.getByText('Min ønskeliste').click();
    await this.dismissCookieBanner();
  }

  async createWishlist(name: string, description?: string) {
    await this.createWishlistButton.click();
    
    await this.wishlistNameInput.fill(name);
    if (description) {
      if (await this.wishlistDescriptionInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.wishlistDescriptionInput.fill(description);
      }
    }
    await this.saveWishlistButton.click();
    await this.waitForPageLoad(); 
  }

  async addWishItem(title: string, url?: string, price?: string) {
    await this.addWishButton.click();
    await this.wishTitleInput.fill(title);
    if (url && await this.wishUrlInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.wishUrlInput.fill(url);
    }
    if (price && await this.wishPriceInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.wishPriceInput.fill(price);
    }
    await this.saveWishButton.click();
    await this.waitForPageLoad();
  }

  async getWishlistCount(): Promise<number> {
    return this.wishlistCards.count();
  }

  async getWishItemCount(): Promise<number> {
    return this.wishItems.count();
  }

  async openFirstWishlist() {
    await this.firstWishlistCard.click();
    await this.waitForPageLoad();
  }

  async expectWishlistVisible(name: string) {
    await expect(this.page.locator(`text="${name}"`)).toBeVisible();
  }
}
