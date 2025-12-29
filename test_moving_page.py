from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:4321/moving')
    page.wait_for_load_state('networkidle')
    
    # Check if canvas exists
    canvas = page.query_selector('canvas')
    if canvas:
        print("✓ Canvas element found")
    else:
        print("✗ Canvas element NOT found")
    
    # Check for chart data
    scripts = page.query_selector_all('script')
    print(f"✓ Found {len(scripts)} script tags")
    
    # Take screenshot
    page.screenshot(path='/tmp/moving_page.png', full_page=True)
    print("✓ Screenshot saved")
    
    browser.close()
    print("Test complete")
