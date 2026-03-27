import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage — onskeskyen.dk landing page.
 * Covers the marketing/hero section and primary CTAs.
 */
export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly ctaCreateWishlist: Locator;
  readonly ctaLogin: Locator;
  readonly navLogo: Locator;
  readonly navLoginLink: Locator;
  readonly navSignupLink: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.heroHeading = page.locator('h1').first();
    this.navLogo = page.getByTestId('navBar').getByRole('link').filter({ hasText: /^$/ });
    this.navLoginLink = page.getByRole('button', { name: 'Log ind' });
    this.navSignupLink = page.locator('a[href*="opret"], a[href*="signup"], a:has-text("Opret"), a:has-text("Tilmeld")').first();
    this.ctaCreateWishlist = page.locator('a:has-text("Opret ønskeliste"), a:has-text("Kom i gang"), button:has-text("Opret")').first();
    this.ctaLogin = page.locator('a:has-text("Log ind"), button:has-text("Log ind")').first();
    this.searchInput = page.locator('input[type="search"], input[placeholder*="søg"], [data-testid="search"]').first();
  }

  async open() {
    await this.goto('/');
    await this.dismissCookieBanner();
  }

  async clickLogin() {
    await this.navLoginLink.click();
  }

  async clickSignup() {
    await this.navSignupLink.click();
  }

  async clickCreateWishlist() {
    await this.ctaCreateWishlist.click();
  }
}
