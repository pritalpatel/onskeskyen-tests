import { Page } from '@playwright/test';

/**
 * Shared utility functions used across multiple test files.
 */

export function randomEmail(prefix = 'test'): string {
  return `${prefix}+${Date.now()}@mailinator.com`;
}

export function randomName(): string {
  const names = ['Alice', 'Bob', 'Charlie', 'Dana', 'Erik', 'Fiona'];
  return `${names[Math.floor(Math.random() * names.length)]} ${Date.now()}`;
}

export function randomWishlistName(): string {
  const themes = ['Fødselsdag', 'Jul', 'Bryllup', 'Konfirmation', 'Barnedåb'];
  return `${themes[Math.floor(Math.random() * themes.length)]} ${Date.now()}`;
}

export async function waitForNetworkIdle(page: Page, timeout = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function dismissCookieBanner(page: Page): Promise<void> {
  const selectors = [
    'button:has-text("Accepter alle")',
    'button:has-text("Accepter")',
    'button:has-text("Accept all")',
    'button:has-text("Accept")',
    '[data-testid="cookie-accept"]',
    '#cookie-accept',
    '.cookie-accept',
  ];
  for (const sel of selectors) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await btn.click();
      return;
    }
  }
}

export async function maskDynamicContent(page: Page): Promise<void> {
  await page.evaluate(() => {
    const selectors = ['time', '.timestamp', '.date', '[data-testid="created-at"]', '.ago'];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });
  });
}

export async function triggerLazyLoad(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>(resolve => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
  await page.waitForTimeout(300);
}

export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}
