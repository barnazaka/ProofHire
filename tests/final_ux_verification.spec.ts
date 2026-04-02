import { test, expect } from '@playwright/test';

test('verify premium landing page and navigation', async ({ page }) => {
  // Use 3001 if 3000 is occupied, but I'll try 3000 first as per my previous kill command
  await page.goto('http://localhost:3000/');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Check branding from the new page.tsx
  // "Talent OS" and "Recruiter Engine" are in the hero section now
  await expect(page.locator('text=Talent OS')).toBeVisible();
  await expect(page.locator('text=Recruiter Engine')).toBeVisible();

  // Navigate to Features (use the one in the nav)
  await page.locator('nav').getByText('Features').click();
  await page.waitForURL('**/features', { timeout: 10000 });
  await expect(page.locator('text=Built for Scale.')).toBeVisible();
  await page.goto('http://localhost:3000/');

  // Navigate to Launch
  await page.getByRole('link', { name: /Launch/i }).first().click();
  await page.waitForURL('**/launch', { timeout: 10000 });
  await expect(page.locator('text=Choose Your Access.')).toBeVisible();

  // Test Talent Login Flow
  await page.getByRole('link', { name: /Talent/i }).click();
  await page.waitForURL('**/talent/login', { timeout: 10000 });
  await page.getByRole('button', { name: /Connect Lace Wallet/i }).click();

  // Wait for simulation and redirect to /talent
  await page.waitForURL('**/talent', { timeout: 15000 });
  await expect(page.locator('text=Talent OS')).toBeVisible();

  // Check Logout - it's the dropdown toggle first
  // The toggle has the shortened address, e.g. "addr_mid..."
  await page.click('button:has-text("addr_")');
  await page.click('text=Disconnect');
  await page.waitForURL('**/', { timeout: 10000 });
});
