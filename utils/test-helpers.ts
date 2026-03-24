import { Page } from '@playwright/test';

/**
 * test-helpers.ts
 * ────────────────
 * Shared utility functions used across multiple test files.
 */

// ── Random data generators ─────────────────────────────────────────────────

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

// ── Page helpers ───────────────────────────────────────────────────────────

/**
 * Wait for network to be quiet (no requests for 500ms).
 * More reliable than waitForLoadState('networkidle') on SPAs.
 */
export async function waitForNetworkIdle(page: Page, timeout = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Dismiss cookie consent banner if present.
 * Safe to call even if there is no banner.
 */
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

/**
 * Mask dynamic content (timestamps, IDs) to reduce visual diff noise.
 * Call before taking a screenshot snapshot.
 */
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

/**
 * Scroll to the bottom and back to top to trigger lazy-loaded images,
 * ensuring screenshots are complete.
 */
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

// ── Assertion helpers ──────────────────────────────────────────────────────

/**
 * Returns true if the element exists in the DOM (even if hidden).
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}
