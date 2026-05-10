"""
RILEY 🧪 — Selenium tests for About Page inline content editing (Option 1)
Target: https://code-ui.brightcone.ai/about

Tests cover:
1. Edit mode banner is visible on page load
2. Clicking "Enable editing" activates edit mode
3. Clicking editable text opens an input/textarea
4. Typing new text and pressing Enter saves it
5. Text persists after page reload (localStorage)
6. "Done editing" returns to view mode
7. "Reset all" reverts to defaults after confirm dialog
8. ESC key cancels edit without saving
"""

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL = "https://code-ui.brightcone.ai"
ABOUT_URL = f"{BASE_URL}/about"


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


def go_to_about(driver):
    driver.get(ABOUT_URL)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1 | //h2"))
    )
    # clear localStorage to start fresh
    driver.execute_script("localStorage.clear()")
    driver.refresh()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1 | //h2"))
    )


def get_edit_banner_button(driver, label_contains: str):
    """Find a button inside the edit mode banner by partial text."""
    return WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable(
            (By.XPATH, f"//button[contains(text(), '{label_contains}')]")
        )
    )


# ── Test 1: Banner is visible on load ────────────────────────────────────────
def test_edit_banner_visible_on_load(driver):
    go_to_about(driver)
    banner = driver.find_element(By.XPATH, "//span[contains(text(), 'Edit mode')]")
    assert banner.is_displayed(), "Edit mode banner should be visible on page load"


# ── Test 2: Enable editing activates edit mode ───────────────────────────────
def test_enable_edit_mode(driver):
    go_to_about(driver)
    btn = get_edit_banner_button(driver, "Enable editing")
    btn.click()
    time.sleep(0.3)
    # Banner text should update to show "Edit mode ON"
    on_text = driver.find_element(
        By.XPATH, "//span[contains(text(), 'Edit mode ON')]"
    )
    assert on_text.is_displayed(), "Banner should show 'Edit mode ON' after enabling"


# ── Test 3: Clicking editable text opens an input ───────────────────────────
def test_click_text_opens_input(driver):
    go_to_about(driver)
    # enable edit mode
    get_edit_banner_button(driver, "Enable editing").click()
    time.sleep(0.3)
    # find and click the hero badge text
    badge = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable(
            (By.XPATH, "//span[contains(@title, 'Click to edit')]")
        )
    )
    badge.click()
    time.sleep(0.2)
    # input or textarea should appear
    inputs = driver.find_elements(By.XPATH, "//input[@type='text'] | //textarea")
    assert len(inputs) > 0, "An input/textarea should appear after clicking editable text"


# ── Test 4: Typing and pressing Enter saves the text ────────────────────────
def test_type_and_save_with_enter(driver):
    go_to_about(driver)
    get_edit_banner_button(driver, "Enable editing").click()
    time.sleep(0.3)

    # click the hero badge
    badge = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable(
            (By.XPATH, "//span[contains(@title, 'Click to edit')]")
        )
    )
    badge.click()
    time.sleep(0.2)

    inp = driver.find_element(By.XPATH, "//input[@type='text']")
    inp.clear()
    inp.send_keys("Edited Badge Text")
    inp.send_keys(Keys.RETURN)
    time.sleep(0.2)

    # badge should now show new text
    updated = driver.find_element(
        By.XPATH, "//span[contains(text(), 'Edited Badge Text')]"
    )
    assert updated.is_displayed(), "Saved text should appear after pressing Enter"


# ── Test 5: Text persists after page reload ──────────────────────────────────
def test_text_persists_after_reload(driver):
    # Continue from previous test (localStorage has the saved value)
    driver.refresh()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1 | //h2"))
    )
    time.sleep(0.5)
    # The saved badge text should still be visible (read from localStorage)
    updated = driver.find_element(
        By.XPATH, "//*[contains(text(), 'Edited Badge Text')]"
    )
    assert updated.is_displayed(), "Edited text should persist after page reload"


# ── Test 6: Done editing returns to view mode ────────────────────────────────
def test_done_editing_returns_to_view_mode(driver):
    go_to_about(driver)
    get_edit_banner_button(driver, "Enable editing").click()
    time.sleep(0.3)
    get_edit_banner_button(driver, "Done editing").click()
    time.sleep(0.2)
    # Banner should show "Edit mode OFF"
    off_text = driver.find_element(
        By.XPATH, "//span[contains(text(), 'Edit mode OFF')]"
    )
    assert off_text.is_displayed(), "Banner should show 'Edit mode OFF' after clicking Done"


# ── Test 7: ESC cancels edit without saving ──────────────────────────────────
def test_escape_cancels_edit(driver):
    go_to_about(driver)
    get_edit_banner_button(driver, "Enable editing").click()
    time.sleep(0.3)

    badge = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable(
            (By.XPATH, "//span[contains(@title, 'Click to edit')]")
        )
    )
    original_text = badge.text
    badge.click()
    time.sleep(0.2)

    inp = driver.find_element(By.XPATH, "//input[@type='text']")
    inp.clear()
    inp.send_keys("THIS SHOULD NOT SAVE")
    inp.send_keys(Keys.ESCAPE)
    time.sleep(0.2)

    # original text should still be visible, not the typed one
    assert "THIS SHOULD NOT SAVE" not in driver.page_source, \
        "ESC should cancel edit and not save the typed text"


# ── Test 8: Reset all button triggers confirm and resets text ────────────────
def test_reset_all_reverts_defaults(driver):
    # First save something
    go_to_about(driver)
    get_edit_banner_button(driver, "Enable editing").click()
    time.sleep(0.3)

    badge = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable(
            (By.XPATH, "//span[contains(@title, 'Click to edit')]")
        )
    )
    badge.click()
    time.sleep(0.2)
    inp = driver.find_element(By.XPATH, "//input[@type='text']")
    inp.clear()
    inp.send_keys("Temp Text")
    inp.send_keys(Keys.RETURN)
    time.sleep(0.2)

    # Click Reset all — accept the confirm dialog
    reset_btn = get_edit_banner_button(driver, "Reset all")
    reset_btn.click()
    WebDriverWait(driver, 3).until(EC.alert_is_present())
    driver.switch_to.alert.accept()

    # Page reloads — default text should be back
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1 | //h2"))
    )
    time.sleep(0.5)
    assert "About Brightcone" in driver.page_source, \
        "After reset, default text 'About Brightcone' should be restored"
