import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — handles the sign-in form at /login (or equivalent).
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByRole('textbox', { name: 'E-mail' });
    this.passwordInput = page.getByTestId('loginPasswordInput');
    this.submitButton = page.getByRole('button', { name: 'Log ind' });
    this.errorMessage = page.locator('.error, [role="alert"], .alert-danger, [data-testid="login-error"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Glemt"), a:has-text("Forgot")').first();
    this.signupLink = page.locator('a:has-text("Opret"), a:has-text("Tilmeld"), a[href*="signup"]').first();
  }

  async open() {
    await this.goto('/login');
    await this.dismissCookieBanner();
  }

  async login(email: string, password: string) {
    await this.page.getByRole('button', { name: 'Log ind' }).click()
    await this.page.getByRole('button', { name: 'photo Fortsæt med e-mail' }).click();
    await this.page.getByRole('textbox', { name: 'E-mail' }).click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForPageLoad();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectLoginSuccess() {
    await expect(this.page).not.toHaveURL(/\/login/);
  }
}
