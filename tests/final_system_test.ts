import { chromium, expect } from '@playwright/test';

async function finalSystemTest() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- FINAL SYSTEM-WIDE INTEGRATION TEST: PROOFHIRE ---');
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  // 1. TALENT FLOW: Signup & Profile
  await page.goto('http://localhost:3000/talent/auth');
  await page.click('button:has-text("Connect Lace Wallet")');

  console.log('Waiting for Confirm button...');
  await page.waitForSelector('button:has-text("Confirm")', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("Confirm")');

  await page.waitForURL('**/talent/dashboard', { timeout: 30000 });
  console.log('Step 1: Talent Authentication Complete.');
  await page.screenshot({ path: 'after_talent_auth.png' });

  await page.click('a[href="/talent/profile"]');
  await page.waitForSelector('input[name="fullName"]');
  await page.fill('input[name="fullName"]', 'Alice ZK');
  await page.fill('input[name="yearsExperience"]', '7');
  await page.click('button:has-text("Save Locally")');
  console.log('Step 2: Talent Local Profile Saved.');

  // 2. TALENT FLOW: Proof Generation
  await page.goto('http://localhost:3000/talent/proofs');
  await page.waitForSelector('button:has-text("University Degree")', { state: 'visible', timeout: 30000 });
  await page.click('button:has-text("University Degree")');

  console.log('Proving started...');
  await page.waitForSelector('text=Client-Side Proving Protocol Active', { state: 'visible', timeout: 10000 });
  await page.screenshot({ path: 'during_proving.png' });
  await page.waitForSelector('text=Client-Side Proving Protocol Active', { state: 'hidden', timeout: 45000 });
  await page.screenshot({ path: 'after_proving_hidden.png' });
  await page.waitForSelector('text=ON-CHAIN COMMIT', { state: 'visible', timeout: 30000 });
  console.log('Step 3: Talent ZK Proof Generated and Committed.');

  // 3. RECRUITER FLOW: Dashboard & Verification
  await page.goto('http://localhost:3000/recruiter/auth');
  await page.click('button:has-text("Connect Lace Wallet")');
  await page.waitForSelector('button:has-text("Confirm")', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("Confirm")');

  await page.waitForURL('**/recruiter/dashboard', { timeout: 30000 });
  console.log('Step 4: Recruiter Authentication Complete.');

  await page.click('a[href="/recruiter/candidates"]');
  await page.waitForSelector('button:has-text("Verify Proof")');
  await page.click('button:has-text("Verify Proof")');
  await page.waitForSelector('text=Valid Proof', { state: 'visible', timeout: 30000 });
  console.log('Step 5: Recruiter Mathematical Verification Complete.');

  // 4. FINAL STATUS
  console.log('--- ALL SYSTEMS OPERATIONAL ---');
  await page.screenshot({ path: 'final_system_test_success.png' });
  await browser.close();
}

finalSystemTest().catch(err => {
  console.error('Final Test Failed:', err);
  process.exit(1);
});
