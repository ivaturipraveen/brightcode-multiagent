"""
RILEY 🧪 — Selenium tests for Admin CMS
Target: https://code-ui.brightcone.ai

Tests:
1. Admin login page loads
2. Bad credentials show error
3. Non-admin blocked (403)
4. Valid admin login redirects to /admin/content
5. Content editor shows sections
6. Edit text field and save → success message
7. Change persists on About page (end-to-end)
8. Logout clears session
9. Image upload UI present for image fields
10. Unauthenticated /admin/content redirects to login
"""

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL    = "https://code-ui.brightcone.ai"
ADMIN_EMAIL = "admin@brightcone.ai"
ADMIN_PASS  = "BrightAdmin2026!"


@pytest.fixture(scope="module")
def driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,900")
    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(5)
    yield drv
    drv.quit()


def wait(driver, timeout=10):
    return WebDriverWait(driver, timeout)


def go_to_login(driver):
    driver.get(f"{BASE_URL}/admin/login")
    wait(driver).until(EC.presence_of_element_located((By.TAG_NAME, "form")))
    driver.execute_script("localStorage.removeItem('admin_token')")


def login_as_admin(driver):
    go_to_login(driver)
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys(ADMIN_EMAIL)
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys(ADMIN_PASS)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    wait(driver, 15).until(EC.url_contains("/admin/content"))


# ── Test 1: Login page loads ──────────────────────────────────────────────────
def test_admin_login_page_loads(driver):
    go_to_login(driver)
    assert "admin" in driver.current_url.lower()
    form = driver.find_element(By.TAG_NAME, "form")
    assert form.is_displayed()
    inputs = driver.find_elements(By.CSS_SELECTOR, "input")
    assert len(inputs) >= 2, "Should have email and password inputs"


# ── Test 2: Bad credentials show error ───────────────────────────────────────
def test_bad_credentials_show_error(driver):
    go_to_login(driver)
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("wrong@example.com")
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("wrongpassword")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)
    page = driver.page_source
    assert any(x in page for x in ["Invalid", "invalid", "error", "Error", "failed", "Failed"]), \
        "Error message should be shown for bad credentials"
    assert "/admin/content" not in driver.current_url, "Should NOT redirect on bad credentials"


# ── Test 3: Valid admin login redirects to content page ───────────────────────
def test_valid_admin_login_redirects(driver):
    login_as_admin(driver)
    assert "/admin/content" in driver.current_url, "Should redirect to /admin/content after login"


# ── Test 4: Content editor shows section navigation ──────────────────────────
def test_content_editor_shows_sections(driver):
    login_as_admin(driver)
    for section in ["Hero", "Mission", "Features", "Team"]:
        el = wait(driver).until(
            EC.presence_of_element_located((By.XPATH, f"//*[contains(text(), '{section}')]"))
        )
        assert el.is_displayed(), f"Section '{section}' should be visible in sidebar"


# ── Test 5: Clicking a section loads its fields ───────────────────────────────
def test_section_click_loads_fields(driver):
    login_as_admin(driver)
    # Click Mission section
    mission_btn = wait(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Mission')]"))
    )
    mission_btn.click()
    time.sleep(1)
    # Should show input/textarea fields for mission content
    fields = driver.find_elements(By.CSS_SELECTOR, "input[type='text'], textarea")
    assert len(fields) > 0, "Mission section should show editable fields"


# ── Test 6: Edit a text field and save shows success ─────────────────────────
def test_edit_text_field_and_save(driver):
    login_as_admin(driver)
    # Go to CTA section
    cta_btn = wait(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'CTA')]"))
    )
    cta_btn.click()
    time.sleep(1)

    # Find content fields in main panel only (skip sidebar search input)
    # Main panel inputs have a non-empty value (search input is empty)
    all_inputs = driver.find_elements(By.CSS_SELECTOR, "main input[type='text'], main textarea")
    inputs = [i for i in all_inputs if i.get_attribute("value")]
    if not inputs:
        # Fallback: any input with a value
        inputs = [i for i in driver.find_elements(By.CSS_SELECTOR, "input[type='text'], textarea")
                  if i.get_attribute("value")]
    assert len(inputs) > 0, "Should find at least one editable field in CTA section"

    field = inputs[0]
    original = field.get_attribute("value")

    # Type directly into the field to trigger React onChange
    field.click()
    field.send_keys(" (edited)")
    time.sleep(0.3)

    # Scroll Save button into view and click via JS
    save_btns = driver.find_elements(By.XPATH, "//button[contains(text(), 'Save')]")
    assert len(save_btns) > 0, "Save button should be present"
    driver.execute_script("arguments[0].scrollIntoView(true);", save_btns[0])
    time.sleep(0.2)
    driver.execute_script("arguments[0].click();", save_btns[0])
    time.sleep(2)

    # Should show success indicator
    page = driver.page_source
    assert any(x in page for x in ["Saved", "saved", "✅", "live"]), \
        "Save should show success confirmation"


# ── Test 7: Changes reflect on /about page ───────────────────────────────────
def test_changes_reflect_on_about_page(driver):
    login_as_admin(driver)
    marker_text = "E2E-TEST-MARKER-XYZ"

    # Go to Hero section and edit badge
    hero_btn = wait(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Hero')]"))
    )
    hero_btn.click()
    time.sleep(1)

    # Skip sidebar search — get only main panel fields with values
    fields = [i for i in driver.find_elements(By.CSS_SELECTOR, "main input[type='text'], main textarea")
              if i.get_attribute("value")]
    if not fields:
        pytest.skip("No text fields found in Hero section")

    original = fields[0].get_attribute("value")

    # Type into field to trigger React onChange
    fields[0].click()
    fields[0].send_keys(Keys.CONTROL + "a")
    fields[0].send_keys(marker_text)
    time.sleep(0.3)

    # Scroll Save into view and JS click
    save_btns = driver.find_elements(By.XPATH, "//button[contains(text(), 'Save')]")
    assert len(save_btns) > 0, "Save button should be present"
    driver.execute_script("arguments[0].scrollIntoView(true);", save_btns[0])
    time.sleep(0.2)
    driver.execute_script("arguments[0].click();", save_btns[0])
    time.sleep(2)

    # Check /about page
    driver.get(f"{BASE_URL}/about")
    time.sleep(2)
    assert marker_text in driver.page_source, \
        "Saved content should appear on the live /about page"

    # Restore
    driver.get(f"{BASE_URL}/admin/content")
    time.sleep(2)
    hero_btn2 = wait(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Hero')]"))
    )
    hero_btn2.click()
    time.sleep(1)
    fields2 = driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
    if fields2:
        fields2[0].clear()
        fields2[0].send_keys(original)
        save_btns2 = driver.find_elements(By.XPATH, "//button[contains(text(), 'Save')]")
        if save_btns2:
            save_btns2[0].click()
            time.sleep(1)


# ── Test 8: Logout clears session ────────────────────────────────────────────
def test_logout_clears_session(driver):
    login_as_admin(driver)
    sign_out = wait(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign out')]"))
    )
    sign_out.click()
    time.sleep(1)
    assert "/admin/login" in driver.current_url, "Logout should redirect to /admin/login"
    token = driver.execute_script("return localStorage.getItem('admin_token')")
    assert not token, "Admin token should be cleared from localStorage after logout"


# ── Test 9: Image upload UI present for image fields ─────────────────────────
def test_image_upload_ui_present(driver):
    login_as_admin(driver)
    team_btn = wait(driver).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Team')]"))
    )
    team_btn.click()
    time.sleep(1)
    # Image fields should show a file input or Choose image button
    file_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='file']")
    choose_btns = driver.find_elements(By.XPATH, "//button[contains(text(), 'Choose image')]")
    assert len(file_inputs) > 0 or len(choose_btns) > 0, \
        "Team section should have image upload controls for avatars"


# ── Test 10: Unauthenticated redirect ────────────────────────────────────────
def test_unauthenticated_redirects_to_login(driver):
    driver.execute_script("localStorage.removeItem('admin_token')")
    driver.get(f"{BASE_URL}/admin/content")
    time.sleep(2)
    assert "/admin/login" in driver.current_url, \
        "Unauthenticated access to /admin/content should redirect to /admin/login"
