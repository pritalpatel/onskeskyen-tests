import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ProfilePage } from '../pages/ProfilePage';

/**
 * Extended test fixtures — inject Page Object instances into every test.
 *
 * Usage in tests:
 *   test('...', async ({ homePage, wishlistPage }) => { ... })
 */
type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  wishlistPage: WishlistPage;
  profilePage: ProfilePage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
});

export { expect } from '@playwright/test';
