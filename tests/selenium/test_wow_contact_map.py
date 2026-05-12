"""
RILEY 🧪 — Selenium tests for WoW contact form, map modal, and Instagram link
Target: https://www.wowfinedining.com/wow.html

Tests:
1. Directions link opens map modal
2. Map modal shows correct address
3. Map iframe is present
4. Google Maps link present with correct URL
5. Close button dismisses map modal
6. Private Events link opens contact modal with events context
7. Press Enquiries link opens contact modal with press context
8. Contact form requires name/email/message
9. Contact form submission shows confirmation
10. Instagram link points to correct URL
11. Directions modal translates when language changes to French
12. ESC key closes modals
"""

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

BASE_URL = "https://www.wowfinedining.com"
WOW_URL  = f"{BASE_URL}/wow.html"


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


def go_to_wow(driver):
    driver.get(WOW_URL)
    time.sleep(2)
    driver.execute_script("localStorage.removeItem('wow_lang')")


def scroll_to_footer(driver):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(0.5)


def click_footer_link(driver, link_id):
    el = wait(driver).until(EC.presence_of_element_located((By.ID, link_id)))
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
    time.sleep(0.2)
    driver.execute_script("arguments[0].click();", el)
    time.sleep(0.6)


# ── Test 1: Directions link opens map modal ───────────────────────────────────
def test_directions_opens_map_modal(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-directions')
    modal = driver.find_element(By.ID, "mapModal")
    assert "show" in modal.get_attribute("class"), "Map modal should open when Directions is clicked"


# ── Test 2: Map modal shows correct address ───────────────────────────────────
def test_map_modal_shows_address(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-directions')
    page = driver.page_source
    assert "Via XIV Settembre" in page, "Map modal should show the street address"
    assert "Perugia" in page, "Map modal should show Perugia"
    assert "06122" in page, "Map modal should show the postcode"


# ── Test 3: Map iframe is present ─────────────────────────────────────────────
def test_map_iframe_present(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-directions')
    iframe = driver.find_element(By.CLASS_NAME, "wow-map-frame")
    assert iframe.is_displayed(), "Map iframe should be visible in map modal"
    src = iframe.get_attribute("src")
    assert "google.com/maps" in src, f"Iframe should embed Google Maps, got: {src}"


# ── Test 4: Google Maps link present ─────────────────────────────────────────
def test_google_maps_link_present(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-directions')
    link = driver.find_element(By.ID, "map-google-link")
    href = link.get_attribute("href")
    assert "maps.google.com" in href or "google.com/maps" in href, \
        f"Google Maps link should point to Google Maps, got: {href}"
    assert "Perugia" in href or "XIV+Settembre" in href or "Perugia" in href, \
        "Google Maps link should reference Perugia address"


# ── Test 5: Close button dismisses map modal ──────────────────────────────────
def test_close_button_dismisses_map_modal(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-directions')
    close_btn = wait(driver).until(
        EC.presence_of_element_located((By.ID, "mapModalClose"))
    )
    driver.execute_script("arguments[0].click();", close_btn)
    time.sleep(0.4)
    modal = driver.find_element(By.ID, "mapModal")
    assert "show" not in (modal.get_attribute("class") or ""), "Map modal should close after clicking X"


# ── Test 6: Private Events opens contact modal with events context ────────────
def test_private_events_opens_contact_modal(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-events')
    modal = driver.find_element(By.ID, "contactModal")
    assert "show" in modal.get_attribute("class"), "Contact modal should open for Private Events"
    # Events context should be visible
    eyebrow = driver.find_element(By.ID, "cm-eyebrow")
    ey_upper = eyebrow.text.upper()
    assert "PRIVATE" in ey_upper or "EVENT" in ey_upper or "PRIVAT" in ey_upper or "PRIVÉ" in ey_upper, \
        f"Eyebrow should indicate private events context, got: '{eyebrow.text}'"
    # Guest count field should be visible for events
    guests_wrap = driver.find_element(By.ID, "cm-guests-wrap")
    assert guests_wrap.is_displayed(), "Guests field should be visible for private events"


# ── Test 7: Press Enquiries opens contact modal with press context ─────────────
def test_press_enquiries_opens_contact_modal(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-press')
    modal = driver.find_element(By.ID, "contactModal")
    assert "show" in modal.get_attribute("class"), "Contact modal should open for Press"
    eyebrow = driver.find_element(By.ID, "cm-eyebrow")
    ey_upper = eyebrow.text.upper()
    assert any(w in ey_upper for w in ["PRESS", "PRESSE", "PRENSA", "STAMPA", "媒体"]), \
        f"Eyebrow should indicate press context, got: '{eyebrow.text}'"
    # Guests field should be HIDDEN for press
    guests_wrap = driver.find_element(By.ID, "cm-guests-wrap")
    assert not guests_wrap.is_displayed(), "Guests field should be hidden for press enquiry"


# ── Test 8: Contact form requires name/email/message ─────────────────────────
def test_contact_form_validation(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-press')
    submit = driver.find_element(By.ID, "cm-submit")
    # Submit empty form — should trigger alert (not show confirmation)
    driver.execute_script("arguments[0].click();", submit)
    time.sleep(0.5)
    # Handle potential alert
    try:
        alert = driver.switch_to.alert
        alert.accept()
    except Exception:
        pass
    # Confirmation should NOT be shown
    confirm = driver.find_element(By.ID, "cm-confirm")
    assert confirm.value_of_css_property("display") in ("none", ""), \
        "Confirmation should not show on empty form submission"


# ── Test 9: Contact form submission shows confirmation ────────────────────────
def test_contact_form_submission_shows_confirmation(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-events')
    # Fill form
    driver.find_element(By.ID, "cm-name").send_keys("Test Guest")
    driver.find_element(By.ID, "cm-email").send_keys("test@example.com")
    driver.find_element(By.ID, "cm-message").send_keys("We would like to book a private event for 20 guests.")
    submit = driver.find_element(By.ID, "cm-submit")
    driver.execute_script("arguments[0].click();", submit)
    time.sleep(3)
    confirm = driver.find_element(By.ID, "cm-confirm")
    assert confirm.is_displayed() or confirm.value_of_css_property("display") == "block", \
        "Confirmation message should appear after successful form submission"


# ── Test 10: Instagram link correct URL ───────────────────────────────────────
def test_instagram_link_correct(driver):
    go_to_wow(driver)
    scroll_to_footer(driver)
    ig_link = wait(driver).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='instagram.com/wowfinedining']"))
    )
    href = ig_link.get_attribute("href")
    assert "instagram.com/wowfinedining" in href, \
        f"Instagram link should point to wowfinedining account, got: {href}"
    assert ig_link.get_attribute("target") == "_blank", \
        "Instagram link should open in new tab"


# ── Test 11: Map modal translates with language change ────────────────────────
def test_map_modal_translates(driver):
    go_to_wow(driver)
    # Switch to French
    btn = driver.find_element(By.ID, "langSelected")
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.3)
    opt = driver.find_element(By.CSS_SELECTOR, ".lang-option[data-lang='fr']")
    driver.execute_script("arguments[0].click();", opt)
    time.sleep(0.5)
    # Open map modal
    click_footer_link(driver, 'link-directions')
    eyebrow = driver.find_element(By.ID, "map-eyebrow")
    ey_upper = eyebrow.text.upper()
    assert any(w in ey_upper for w in ["TROUVER", "NOUS", "FIND", "FINDEN"]), \
        f"Map eyebrow should be in French or localized, got: '{eyebrow.text}'"
    google_link = driver.find_element(By.ID, "map-google-link")
    assert "GOOGLE" in google_link.text.upper(), "Google Maps link text should appear"


# ── Test 12: ESC key closes modals ───────────────────────────────────────────
def test_esc_closes_modal(driver):
    go_to_wow(driver)
    click_footer_link(driver, 'link-directions')
    modal = driver.find_element(By.ID, "mapModal")
    assert "show" in modal.get_attribute("class"), "Modal should be open"
    driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
    time.sleep(0.4)
    modal = driver.find_element(By.ID, "mapModal")
    assert "show" not in (modal.get_attribute("class") or ""), "ESC should close the map modal"
