import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SignupPage — handles new account registration.
 */
export class SignupPage extends BasePage {
  readonly nameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    super(page);

    this.nameInput = page.getByRole('textbox', { name: 'Fornavn' });
    this.lastnameInput = page.getByRole('textbox', { name: 'Efternavn' });
    this.emailInput = page.getByRole('textbox', { name: 'E-mail' });
    this.passwordInput = page.getByRole('textbox', { name: 'Adgangskode' });
    this.passwordConfirmInput = page.locator('input[name="password_confirmation"], input[name="confirmPassword"], input[placeholder*="gentag"]').first();
    this.submitButton = page.getByRole('button', { name: 'Næste' });
    this.errorMessage = page.getByText('Denne e-mailadresse er');
    this.successMessage = page.locator('.success, .alert-success, [data-testid="signup-success"]').first();
    this.termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="accept"]').first();
  }

  async open() {
    await this.goto('/')
    await this.dismissCookieBanner();
  }

  async openForm() {
    await this.page.getByTestId('navBar').getByRole('button', { name: 'Opret' }).click();
    await this.page.getByRole('button', { name: 'photo Fortsæt med e-mail' }).click();
  }

  async fillForm(name: string, email: string, password: string) {
    if (await this.nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.nameInput.fill(name);
    }

    // Temporary disabled due to false positive faliure
    // if (await this.lastnameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    //   await this.lastnameInput.fill(name);
    // }

    // if (await this.page.locator('#registerSelectMonth').isVisible({ timeout: 2000 }).catch(() => false)) {
    //   await this.page.locator('#registerSelectMonth').selectOption('jan.')
    // }

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (await this.passwordConfirmInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.passwordConfirmInput.fill(password);
    }
    if (await this.termsCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.termsCheckbox.check();
    }
  }

  async submit() {
    await this.submitButton.click();
    await this.waitForPageLoad();
  }

  async expectValidationError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.page.getByRole('dialog').getByRole('button', { name: 'Log ind' })).toBeVisible()
  }
}
