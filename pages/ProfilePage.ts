import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProfilePage — user account settings and profile management.
 */
export class ProfilePage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;
  readonly logoutButton: Locator;
  readonly successMessage: Locator;
  readonly avatarUpload: Locator;
  readonly deleteAccountButton: Locator;

  constructor(page: Page) {
    super(page);

    this.nameInput = page.getByRole('dialog').getByText('Prital Patel').first();
    this.emailInput = page.getByRole('textbox', { name: 'E-mail' });
    this.saveButton = page.locator('button[type="submit"], button:has-text("Gem"), button:has-text("Opdater")').first();
    this.logoutButton = page.getByRole('button', { name: /log af|log out/i });
    this.successMessage = page.locator('.success, .alert-success, [role="status"]').first();
    this.avatarUpload = page.locator('input[type="file"]').first();
    this.deleteAccountButton = page.locator('button:has-text("Slet konto"), [data-testid="delete-account"]').first();
  }

  async open() {
    await this.goto('/')
    await this.page.getByTestId('navbarUserProfileAvatar').click();
    await this.dismissCookieBanner();
  }

  async logout() {
    await this.logoutButton.click();
    await this.waitForPageLoad();
  }

  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/\/(login|$)/);
  }

  async updateName(name: string) {
    await this.nameInput.clear();
    await this.nameInput.fill(name);
    await this.saveButton.click();
    await this.waitForPageLoad();
  }
}
