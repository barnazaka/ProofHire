import { chromium, expect } from '@playwright/test';

async function debugAuth() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- Debugging Auth ---');

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('http://localhost:3000/talent/auth');
  await page.click('button:has-text("Connect Lace Wallet")');

  await page.waitForSelector('button:has-text("Confirm")', { state: 'visible', timeout: 10000 });
  await page.screenshot({ path: 'debug_auth_popup.png' });
  console.log('Confirm button found.');

  await page.click('button:has-text("Confirm")');
  console.log('Clicked Confirm.');

  try {
    await page.waitForURL('**/talent/dashboard', { timeout: 10000 });
    console.log('Success: Redirected to dashboard.');
  } catch (e) {
    console.log('Timeout waiting for redirect.');
    await page.screenshot({ path: 'debug_auth_after_click.png' });
    const content = await page.content();
    console.log('URL after click:', page.url());
  }

  await browser.close();
}

debugAuth();
