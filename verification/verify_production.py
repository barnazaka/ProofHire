from playwright.sync_api import sync_playwright
import time
import os

def run_cuj_talent(page):
    print("Starting Talent Onboarding CUJ...")
    page.goto("http://localhost:3000/talent/auth")
    page.wait_for_timeout(2000)

    # Simulate login (setting localStorage directly as we can't interact with Lace extension)
    page.evaluate("() => { localStorage.setItem('user_address', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'); localStorage.setItem('user_role', 'talent'); }")
    page.goto("http://localhost:3000/talent/onboarding")
    page.wait_for_timeout(1000)

    # Step 1: Personal
    page.get_by_placeholder("Satoshi Nakamoto").fill("Jules Engineer")
    page.get_by_placeholder("sat@protonmail.com").fill("jules@example.com")
    page.get_by_placeholder("Senior Blockchain Architect").fill("Lead ZK Engineer")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Continue").click()
    page.wait_for_timeout(1000)

    # Step 2: Education
    page.get_by_placeholder("University of Oxford").fill("MIT")
    page.get_by_placeholder("Computer Science & Cryptography").fill("Computer Science")
    page.get_by_placeholder("2018").fill("2020")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Continue").click()
    page.wait_for_timeout(1000)

    # Step 3: Experience
    page.get_by_placeholder("Lead Engineer").fill("Senior Dev")
    page.get_by_placeholder("Global Tech Inc").fill("Privacy Co")
    page.get_by_placeholder("3").fill("4")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Continue").click()
    page.wait_for_timeout(1000)

    # Step 4: Skills
    page.get_by_placeholder("e.g. Compact, Rust, Midnight SDK...").fill("Rust")
    page.get_by_role("button", name="Add").click()
    page.wait_for_timeout(500)
    page.get_by_placeholder("e.g. Compact, Rust, Midnight SDK...").fill("Compact")
    page.get_by_role("button", name="Add").click()
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Continue").click()
    page.wait_for_timeout(1000)

    # Step 5: Certs
    page.get_by_role("button", name="Continue").click()
    page.wait_for_timeout(1000)

    # Step 6: Interests
    page.get_by_text("Smart Contract Engineer").click()
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Continue").click()
    page.wait_for_timeout(1000)

    # Step 7: Review
    page.screenshot(path="/home/jules/verification/screenshots/talent_review.png")
    print("Talent Review screenshot saved.")
    page.wait_for_timeout(2000)

def run_cuj_recruiter(page):
    print("Starting Recruiter Browser CUJ...")
    # Setup recruiter session
    page.evaluate("() => { localStorage.setItem('user_address', '0xRecruiterAddr123'); localStorage.setItem('user_role', 'recruiter'); }")
    page.goto("http://localhost:3000/recruiter/candidates")
    page.wait_for_timeout(2000)

    # Show filters
    page.screenshot(path="/home/jules/verification/screenshots/recruiter_browser.png")
    print("Recruiter Browser screenshot saved.")

    # Interaction with filters
    page.get_by_placeholder("e.g. 5").fill("5")
    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/screenshots/recruiter_filtered.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            viewport={'width': 1280, 'height': 800}
        )
        page = context.new_page()
        try:
            run_cuj_talent(page)
            run_cuj_recruiter(page)
        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="/home/jules/verification/screenshots/error.png")
        finally:
            context.close()
            browser.close()
