import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Runs ONCE before the authenticated test projects.
 * Logs in and saves the browser storage state to `.auth/user.json`.
 * All authenticated tests then reuse this state — no repeated logins.
 */

const AUTH_FILE = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing TEST_USER_EMAIL or TEST_USER_PASSWORD env variables.\n' +
      'Copy .env.example → .env and fill in your test account credentials.'
    );
  }

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  await page.goto('https://onskeskyen.dk/login');
  // await page.waitForLoadState('networkidle');

  const cookieBtn = page.getByRole('button', { name: 'Accept Only Neccessary' });
  await cookieBtn.click();

  await page.getByRole('button', { name: 'Log ind' }).click();
  await page.getByRole('button', { name: 'photo Fortsæt med e-mail' }).click();

  await page.getByRole('textbox', { name: 'E-mail' }).fill(email);
  await page.getByTestId('loginPasswordInput').fill(password);
  await page.getByRole('button', { name: 'Log ind' }).click();


  await page.getByTestId('navbarUserProfileAvatar').click();
  await expect(page.getByRole('button', { name: /log af|log out/i })).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });

  console.log(`✅ Auth state saved to ${AUTH_FILE}`);
});
