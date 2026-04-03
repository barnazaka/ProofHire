from playwright.sync_api import sync_playwright
import os

def run_talent_production_check(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(1000)

    # Click Talent entry
    page.get_by_role("link", name="I'm a Talent").click()
    page.wait_for_timeout(1000)

    # Click Connect
    page.get_by_role("button", name="Connect Lace Wallet").click()
    page.wait_for_timeout(2000)

    # Verify production error state
    page.wait_for_selector("text=Lace Wallet NOT Found")
    page.screenshot(path="verification/screenshots/production_talent_check.png")
    page.wait_for_timeout(1000)

def run_recruiter_production_check(page):
    page.goto("http://localhost:3000/recruiter/auth")
    page.wait_for_timeout(1000)

    # Click Connect
    page.get_by_role("button", name="Connect Lace Wallet").click()
    page.wait_for_timeout(2000)

    # Verify production error state
    page.wait_for_selector("text=Lace Wallet NOT Found")
    page.screenshot(path="verification/screenshots/production_recruiter_check.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("verification/screenshots", exist_ok=True)
    os.makedirs("verification/videos", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="verification/videos")
        page = context.new_page()
        try:
            run_talent_production_check(page)
            run_recruiter_production_check(page)
        finally:
            context.close()
            browser.close()
