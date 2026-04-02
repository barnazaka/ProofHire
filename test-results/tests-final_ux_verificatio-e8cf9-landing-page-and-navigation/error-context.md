# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/final_ux_verification.spec.ts >> verify premium landing page and navigation
- Location: tests/final_ux_verification.spec.ts:3:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/features"
Received string:    "http://localhost:3000/"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e8]
        - generic [ref=e11]:
          - generic [ref=e12]: ProofHire
          - generic [ref=e13]: Protocol v1.0
      - navigation [ref=e14]:
        - link "Protocol" [ref=e15] [cursor=pointer]:
          - /url: /protocol
          - text: Protocol
        - link "Privacy" [ref=e16] [cursor=pointer]:
          - /url: /privacy
          - text: Privacy
        - link "Features" [active] [ref=e17] [cursor=pointer]:
          - /url: /features
          - text: Features
      - generic [ref=e19]:
        - button "Toggle Theme" [ref=e20]:
          - img [ref=e21]
        - link "LaunchEngine" [ref=e23] [cursor=pointer]:
          - /url: /launch
          - text: LaunchEngine
    - main [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e31]: Zero-Knowledge Pipeline Active
            - heading "Sovereign Credentials." [level=1] [ref=e32]:
              - text: Sovereign
              - text: Credentials.
            - generic [ref=e33]:
              - generic [ref=e34]:
                - generic [ref=e35]: Access Type A
                - generic [ref=e36]: Talent OS
              - generic [ref=e38]:
                - generic [ref=e39]: Access Type B
                - generic [ref=e40]: Recruiter Engine
            - paragraph [ref=e41]: Mathematically guaranteed verification without disclosure. Re-engineering trust for the 2026 talent economy.
            - generic [ref=e42]:
              - link "Authenticate" [ref=e43] [cursor=pointer]:
                - /url: /launch
                - text: Authenticate
                - img [ref=e44]
              - generic [ref=e48]: Secured by Midnight
          - generic [ref=e49]:
            - generic [ref=e54]:
              - generic [ref=e55]:
                - img [ref=e56]
                - generic [ref=e59]: Private State Verifier
              - paragraph [ref=e62]: "0x6461746120707269766163792069732068756d616e207269676874"
            - img [ref=e64]
            - img [ref=e67]
        - generic [ref=e70]:
          - generic [ref=e71]: Scroll to Explore
          - img [ref=e72]
      - generic [ref=e75]:
        - generic [ref=e76]:
          - heading "The ZK Hiring Protocol." [level=2] [ref=e78]:
            - text: The ZK Hiring
            - text: Protocol.
          - paragraph [ref=e79]: We've abstracted the complexity of Zero-Knowledge Proofs into a seamless hiring experience.
        - generic [ref=e80]:
          - generic [ref=e81]:
            - generic [ref=e82]: "1"
            - heading "Local Input" [level=3] [ref=e83]
            - paragraph [ref=e84]: Enter your credentials in our secure local environment. Data stays in browser memory—never touches a server.
            - generic [ref=e85]:
              - img [ref=e86]
              - generic [ref=e89]: Client-Side Secure
          - generic [ref=e90]:
            - generic [ref=e91]: "2"
            - heading "ZK Proof" [level=3] [ref=e92]
            - paragraph [ref=e93]: Generate mathematical proofs locally. Only cryptographic commitments are sent to the Midnight ledger.
            - generic [ref=e94]:
              - img [ref=e95]
              - generic [ref=e98]: Midnight Compact logic
          - generic [ref=e99]:
            - generic [ref=e100]: "3"
            - heading "Verification" [level=3] [ref=e101]
            - paragraph [ref=e102]: Recruiters verify your claims against the blockchain. They see a "Valid" status, but never your name or PII.
            - generic [ref=e103]:
              - img [ref=e104]
              - generic [ref=e107]: Trustless matching
      - generic [ref=e109]:
        - generic [ref=e110]:
          - generic [ref=e111]:
            - img [ref=e112]
            - generic [ref=e116]: The Infrastructure
          - heading "Powered by Midnight Network." [level=2] [ref=e117]:
            - text: Powered by
            - text: Midnight Network.
          - paragraph [ref=e118]: Midnight is a privacy-first blockchain built as a Cardano sidechain. It supports smart contracts that handle both private and public data using Zero-Knowledge Proofs.
          - generic [ref=e119]:
            - generic [ref=e120]:
              - img [ref=e121]
              - heading "Dual Token" [level=4] [ref=e123]
              - paragraph [ref=e124]: NIGHT for governance, DUST for computation resources.
            - generic [ref=e125]:
              - img [ref=e126]
              - heading "Private Input" [level=4] [ref=e128]
              - paragraph [ref=e129]: Sensitive data stays local. Only proofs enter the ledger.
        - generic [ref=e132]:
          - generic [ref=e133]:
            - img [ref=e134]
            - generic [ref=e143]:
              - text: Security Core
              - paragraph [ref=e144]: Encryption Layer Active
          - generic [ref=e145]:
            - generic [ref=e146]: Network Status
            - generic [ref=e148]: Midnight Preprod
      - generic [ref=e151]:
        - heading "Engineered for Enterprise Privacy." [level=2] [ref=e153]:
          - text: Engineered for
          - text: Enterprise Privacy.
        - generic [ref=e155]:
          - generic [ref=e156]:
            - img [ref=e157]
            - heading "Lace Wallet" [level=4] [ref=e160]
            - paragraph [ref=e161]: Integrated authentication with Cardano's premier wallet.
          - generic [ref=e162]:
            - img [ref=e163]
            - heading "Compact DSL" [level=4] [ref=e166]
            - paragraph [ref=e167]: Logic written in Midnight's statically typed language.
          - generic [ref=e168]:
            - img [ref=e169]
            - heading "DID Integration" [level=4] [ref=e178]
            - paragraph [ref=e179]: Decentralized identifiers for trustless identity.
          - generic [ref=e180]:
            - img [ref=e181]
            - heading "Local Proofs" [level=4] [ref=e184]
            - paragraph [ref=e185]: Zero data leakage. ZK proofs generated in-browser.
    - contentinfo [ref=e186]:
      - generic [ref=e187]:
        - generic [ref=e188]:
          - generic [ref=e189]:
            - img [ref=e191]
            - generic [ref=e194]: ProofHire
          - paragraph [ref=e195]: Decentralized, privacy-first recruitment infrastructure. Re-engineering trust through zero-knowledge proofs on the Midnight Network.
        - generic [ref=e196]:
          - generic [ref=e197]:
            - heading "Resources" [level=5] [ref=e198]
            - list [ref=e199]:
              - listitem [ref=e200]:
                - link "Docs" [ref=e201] [cursor=pointer]:
                  - /url: https://docs.midnight.network/
              - listitem [ref=e202]:
                - link "Github" [ref=e203] [cursor=pointer]:
                  - /url: https://github.com/midnightntwrk
              - listitem [ref=e204]:
                - link "Midnight" [ref=e205] [cursor=pointer]:
                  - /url: https://midnight.network/
          - generic [ref=e206]:
            - heading "Identity" [level=5] [ref=e207]
            - list [ref=e208]:
              - listitem [ref=e209]:
                - link "Talent" [ref=e210] [cursor=pointer]:
                  - /url: /talent
              - listitem [ref=e211]:
                - link "Recruiter" [ref=e212] [cursor=pointer]:
                  - /url: /recruiter
      - generic [ref=e213]:
        - paragraph [ref=e214]: © 2026 PROOFHIRE LABS. ALL PRIVACY RESERVED.
        - generic [ref=e215]:
          - generic [ref=e216]: MIDNIGHT
          - generic [ref=e217]: CARDANO
          - generic [ref=e218]: ZK-PROOFS
  - button "Open Next.js Dev Tools" [ref=e224] [cursor=pointer]:
    - img [ref=e225]
  - alert [ref=e228]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('verify premium landing page and navigation', async ({ page }) => {
  4  |   // Use 3001 if 3000 is occupied, but I'll try 3000 first as per my previous kill command
  5  |   await page.goto('http://localhost:3000/');
  6  |
  7  |   // Wait for the page to load
  8  |   await page.waitForLoadState('networkidle');
  9  |
  10 |   // Check branding from the new page.tsx
  11 |   // "Talent OS" and "Recruiter Engine" are in the hero section now
  12 |   await expect(page.locator('text=Talent OS')).toBeVisible();
  13 |   await expect(page.locator('text=Recruiter Engine')).toBeVisible();
  14 |
  15 |   // Navigate to Features
  16 |   await page.click('text=Features');
> 17 |   await expect(page.url()).toContain('/features');
     |                            ^ Error: expect(received).toContain(expected) // indexOf
  18 |   await expect(page.locator('text=Built for Scale.')).toBeVisible();
  19 |   await page.click('header a'); // Back arrow
  20 |
  21 |   // Navigate to Launch
  22 |   await page.click('text=Launch Engine');
  23 |   await expect(page.url()).toContain('/launch');
  24 |   await expect(page.locator('text=Choose Your Access.')).toBeVisible();
  25 |
  26 |   // Test Talent Login Flow
  27 |   await page.click('text=Talent');
  28 |   await expect(page.url()).toContain('/talent/login');
  29 |   await page.click('text=Connect Lace Wallet');
  30 |
  31 |   // Wait for simulation and redirect to /talent
  32 |   await page.waitForURL('**/talent', { timeout: 15000 });
  33 |   await expect(page.locator('text=Talent OS')).toBeVisible();
  34 |
  35 |   // Check Logout - it's the dropdown toggle first
  36 |   // The toggle has the shortened address, e.g. "addr_mid..."
  37 |   await page.click('button:has-text("addr_")');
  38 |   await page.click('text=Disconnect');
  39 |   await page.waitForURL('**/', { timeout: 10000 });
  40 | });
  41 |
```