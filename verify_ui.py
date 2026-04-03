import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Test Landing
        await page.goto('http://localhost:3000/')
        await page.wait_for_selector('h1', timeout=10000)
        await asyncio.sleep(2) # Wait for animations
        await page.screenshot(path='ui_landing_premium.png')

        # Test Launch
        await page.goto('http://localhost:3000/launch')
        await page.wait_for_selector('h1', timeout=10000)
        await asyncio.sleep(2)
        await page.screenshot(path='ui_launch_premium.png')

        # Test Auth
        await page.goto('http://localhost:3000/talent/auth')
        await page.wait_for_selector('h2', timeout=10000)
        await asyncio.sleep(2)
        await page.screenshot(path='ui_auth_talent_premium.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
