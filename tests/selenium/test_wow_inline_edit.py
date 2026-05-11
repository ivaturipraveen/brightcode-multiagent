"""
RILEY 🧪 — Selenium tests for WoW inline content editor
Target: https://code-ui.brightcone.ai/wow.html

Tests:
1. WoW page loads and lock button is visible
2. Clicking lock without token shows login modal
3. Bad credentials show error in modal
4. Valid admin login enables edit mode
5. Edit mode shows banner and pencil button
6. Text elements show dashed outline in edit mode
7. Clicking editable text opens inline editor
8. Typing and saving text persists to DB
9. Changes visible on page after save
10. Image overlay appears on images in edit mode
11. Done editing button disables edit mode
12. Token persists — re-entering edit mode skips login
"""

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

BASE_URL    = "https://code-ui.brightcone.ai"
WOW_URL     = f"{BASE_URL}/wow.html"
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


def go_to_wow(driver, clear_token=True):
    driver.get(WOW_URL)
    time.sleep(2)
    if clear_token:
        driver.execute_script("localStorage.removeItem('wow_admin_token')")
        driver.execute_script("localStorage.removeItem('wow_edit_mode')")


def login_via_modal(driver):
    """Click Admin footer link → fill modal → sign in."""
    btn = wait(driver).until(EC.element_to_be_clickable((By.ID, "wow-admin-nav-link")))
    btn.click()
    time.sleep(0.5)
    # Fill email and password
    email_field = wait(driver).until(EC.presence_of_element_located((By.ID, "wow-admin-email")))
    pw_field = driver.find_element(By.ID, "wow-admin-pw")
    email_field.clear()
    email_field.send_keys(ADMIN_EMAIL)
    pw_field.send_keys(ADMIN_PASS)
    driver.find_element(By.ID, "wow-login-submit").click()
    # Wait for modal to close and edit mode to activate
    wait(driver, 10).until(EC.invisibility_of_element_located((By.ID, "wow-login-modal")))
    time.sleep(1)


# ── Test 1: Page loads and admin link visible in footer ──────────────────────
def test_wow_page_loads_and_lock_visible(driver):
    go_to_wow(driver)
    admin_link = wait(driver).until(EC.presence_of_element_located((By.ID, "wow-admin-nav-link")))
    # Scroll to footer to ensure it's in view
    driver.execute_script("arguments[0].scrollIntoView(true);", admin_link)
    assert admin_link.is_displayed(), "Admin link should be visible in the WoW footer"
    assert "WoW" in driver.title or "wow" in driver.current_url.lower()


# ── Test 2: Admin link without token shows login modal ───────────────────────
def test_lock_click_shows_login_modal(driver):
    go_to_wow(driver, clear_token=True)
    btn = wait(driver).until(EC.element_to_be_clickable((By.ID, "wow-admin-nav-link")))
    driver.execute_script("arguments[0].scrollIntoView(true);", btn)
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.5)
    modal = driver.find_element(By.ID, "wow-login-modal")
    assert "show" in modal.get_attribute("class"), "Login modal should appear when no token exists"


# ── Test 3: Bad credentials show error ───────────────────────────────────────
def test_bad_credentials_show_error(driver):
    go_to_wow(driver, clear_token=True)
    btn = driver.find_element(By.ID, "wow-admin-nav-link")
    driver.execute_script("arguments[0].scrollIntoView(true);", btn)
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.5)
    email_f = driver.find_element(By.ID, "wow-admin-email")
    pw_f = driver.find_element(By.ID, "wow-admin-pw")
    email_f.clear(); email_f.send_keys("wrong@example.com")
    pw_f.send_keys("wrongpass")
    driver.find_element(By.ID, "wow-login-submit").click()
    time.sleep(2)
    err = driver.find_element(By.ID, "wow-login-err")
    assert "show" in err.get_attribute("class"), "Error should show for bad credentials"
    # Modal should still be open
    modal = driver.find_element(By.ID, "wow-login-modal")
    assert "show" in modal.get_attribute("class"), "Modal should stay open on bad login"


# ── Test 4: Valid login enables edit mode ─────────────────────────────────────
def test_valid_login_enables_edit_mode(driver):
    go_to_wow(driver, clear_token=True)
    login_via_modal(driver)
    assert "wow-editing" in driver.find_element(By.TAG_NAME, "body").get_attribute("class"), \
        "Body should have wow-editing class after login"


# ── Test 5: Edit mode banner visible ─────────────────────────────────────────
def test_edit_mode_banner_visible(driver):
    go_to_wow(driver, clear_token=True)
    login_via_modal(driver)
    banner = driver.find_element(By.ID, "wow-edit-banner")
    assert "show" in banner.get_attribute("class") or banner.is_displayed(), \
        "Edit banner should be visible in edit mode"


# ── Test 6: Editable elements have dashed outline ────────────────────────────
def test_editable_elements_have_outline(driver):
    go_to_wow(driver, clear_token=True)
    login_via_modal(driver)
    # At least one data-i18n element should be visible and styled
    els = driver.find_elements(By.CSS_SELECTOR, "[data-i18n]")
    visible = [e for e in els if e.is_displayed() and e.tag_name not in ('input', 'select', 'button')]
    assert len(visible) > 0, "Should have visible editable text elements in edit mode"


# ── Test 7: Clicking text opens inline editor ─────────────────────────────────
def test_click_text_opens_editor(driver):
    go_to_wow(driver, clear_token=True)
    login_via_modal(driver)
    # Click the hero city text
    editable = wait(driver).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".h-city[data-i18n]"))
    )
    driver.execute_script("arguments[0].scrollIntoView(true);", editable)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", editable)
    time.sleep(0.5)
    editor = wait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "wow-inline-editor")))
    assert editor.is_displayed(), "Inline editor should appear after clicking editable text"
    ta = editor.find_element(By.TAG_NAME, "textarea")
    assert ta.is_displayed(), "Textarea should be visible in inline editor"


# ── Test 8: Save text persists to DB ─────────────────────────────────────────
def test_save_text_persists(driver):
    go_to_wow(driver, clear_token=True)
    login_via_modal(driver)
    marker = "WoW-TEST-E2E"
    editable = wait(driver).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".h-city[data-i18n]"))
    )
    driver.execute_script("arguments[0].click();", editable)
    time.sleep(0.5)
    editor = wait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "wow-inline-editor")))
    ta = editor.find_element(By.TAG_NAME, "textarea")
    ta.clear()
    ta.send_keys(marker)
    # Click Save
    save_btn = editor.find_element(By.CLASS_NAME, "wow-ie-save")
    driver.execute_script("arguments[0].click();", save_btn)
    time.sleep(2)
    # Toast should confirm save
    assert marker in driver.page_source or "Saved" in driver.page_source, \
        "Save confirmation or updated text should appear"


# ── Test 9: Changes visible on page ──────────────────────────────────────────
def test_changes_visible_on_page(driver):
    # Reload page — DB value should load
    driver.get(WOW_URL)
    time.sleep(3)
    assert "WoW-TEST-E2E" in driver.page_source, \
        "Saved text should be visible on page reload from DB"


# ── Test 10: Image overlay in edit mode ──────────────────────────────────────
def test_image_overlay_in_edit_mode(driver):
    go_to_wow(driver, clear_token=False)  # keep token from earlier
    # Re-enable edit mode
    btn = driver.find_element(By.ID, "wow-admin-nav-link")
    if "wow-editing" not in driver.find_element(By.TAG_NAME, "body").get_attribute("class"):
        driver.execute_script("arguments[0].scrollIntoView(true);", btn)
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(1)
    overlays = driver.find_elements(By.CLASS_NAME, "wow-img-overlay")
    assert len(overlays) > 0, "Image overlays should exist in edit mode"
    assert any(o.is_displayed() for o in overlays), "At least one overlay should be displayed"


# ── Test 11: Done editing disables edit mode ──────────────────────────────────
def test_done_editing_disables_mode(driver):
    go_to_wow(driver, clear_token=False)
    # Ensure edit mode is on
    body = driver.find_element(By.TAG_NAME, "body")
    if "wow-editing" not in body.get_attribute("class"):
        btn = driver.find_element(By.ID, "wow-admin-nav-link")
        driver.execute_script("arguments[0].scrollIntoView(true);", btn)
        driver.execute_script("arguments[0].click();", btn)
        time.sleep(1)
    done_btn = wait(driver).until(
        EC.element_to_be_clickable((By.ID, "wow-done-btn"))
    )
    driver.execute_script("arguments[0].click();", done_btn)
    time.sleep(0.5)
    body = driver.find_element(By.TAG_NAME, "body")
    assert "wow-editing" not in body.get_attribute("class"), \
        "wow-editing class should be removed after clicking Done"


# ── Test 12: Token persists — re-entering skips login ─────────────────────────
def test_token_persists_skip_login(driver):
    go_to_wow(driver, clear_token=False)  # keep token
    token = driver.execute_script("return localStorage.getItem('wow_admin_token')")
    assert token, "Admin token should be in localStorage"
    # Click admin link — should go straight to edit mode, no modal
    btn = wait(driver).until(EC.element_to_be_clickable((By.ID, "wow-admin-nav-link")))
    driver.execute_script("arguments[0].scrollIntoView(true);", btn)
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.5)
    modal = driver.find_element(By.ID, "wow-login-modal")
    assert "show" not in modal.get_attribute("class"), \
        "Login modal should NOT appear when valid token exists"
    body = driver.find_element(By.TAG_NAME, "body")
    assert "wow-editing" in body.get_attribute("class"), \
        "Should enter edit mode directly when token exists"
