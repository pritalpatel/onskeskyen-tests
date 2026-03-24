import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — shared helpers inherited by every Page Object.
 * Centralises navigation, screenshot comparison, and common UI patterns.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goto(path = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // ── Visual snapshot helpers ────────────────────────────────────────────────

  /**
   * Assert the full page visually matches the stored baseline.
   * On first run, Playwright creates the baseline automatically.
   */
  async assertPageSnapshot(name: string) {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  }

  /**
   * Assert a specific element visually matches its stored baseline.
   */
  async assertElementSnapshot(locator: Locator, name: string) {
    await expect(locator).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
    });
  }

  // ── Common UI helpers ──────────────────────────────────────────────────────

  async dismissCookieBanner() {
    const acceptBtn = this.page.getByRole('button', { name: 'Accept Only Neccessary' });
    await acceptBtn.waitFor({timeout: 4000}).catch(() => false);

    if (await acceptBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await acceptBtn.click();
    }
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async isLoggedIn(): Promise<boolean> {
    // Check for an element that only exists when authenticated
    return this.page
      .getByRole('button', { name: /log af|log out/i })
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }
}
