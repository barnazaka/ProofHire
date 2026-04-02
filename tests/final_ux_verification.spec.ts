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

  // Navigate to Features
  await page.click('text=Features');
  await expect(page.url()).toContain('/features');
  await expect(page.locator('text=Built for Scale.')).toBeVisible();
  await page.click('header a'); // Back arrow

  // Navigate to Launch
  await page.click('text=Launch Engine');
  await expect(page.url()).toContain('/launch');
  await expect(page.locator('text=Choose Your Access.')).toBeVisible();

  // Test Talent Login Flow
  await page.click('text=Talent');
  await expect(page.url()).toContain('/talent/login');
  await page.click('text=Connect Lace Wallet');

  // Wait for simulation and redirect to /talent
  await page.waitForURL('**/talent', { timeout: 15000 });
  await expect(page.locator('text=Talent OS')).toBeVisible();

  // Check Logout - it's the dropdown toggle first
  // The toggle has the shortened address, e.g. "addr_mid..."
  await page.click('button:has-text("addr_")');
  await page.click('text=Disconnect');
  await page.waitForURL('**/', { timeout: 10000 });
});
