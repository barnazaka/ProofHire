from playwright.sync_api import sync_playwright
import os

def run_production_readiness_check(page):
    # Step 1: Check Landing Page
    page.goto("http://localhost:3000")
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/landing_page_prod.png")

    # Step 2: Go to Talent Auth
    page.get_by_role("link", name="I'm a Talent").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/talent_auth_prod.png")

    # Step 3: Attempt Connection (Should fail because no extension in headless)
    page.get_by_role("button", name="Connect Lace Wallet").click()
    page.wait_for_timeout(2000)

    # Verify "Wallet NOT Found" UI appears (this proves simulation is REMOVED)
    page.wait_for_selector("text=Lace Wallet extension NOT detected")
    page.screenshot(path="verification/screenshots/wallet_missing_error.png")

    # Check for install link
    install_link = page.get_by_role("link", name="Install Lace Wallet")
    if install_link.is_visible():
        print("Success: Real wallet check is active and providing install link.")

    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("verification/screenshots", exist_ok=True)
    os.makedirs("verification/videos", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification/videos")
        page = context.new_page()
        try:
            run_production_readiness_check(page)
        finally:
            context.close()
            browser.close()
