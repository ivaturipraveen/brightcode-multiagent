"""
RILEY 🧪 — Selenium tests for WoW language dropdown (FR, ES, DE + existing EN/IT/ZH)
Target: https://code-ui.brightcone.ai/wow.html

Tests:
1. Language dropdown button visible in nav
2. Clicking dropdown opens language list with 6 options
3. All 6 language options present (EN, IT, FR, ES, DE, ZH)
4. Selecting French translates hero text
5. Selecting Spanish translates hero text
6. Selecting German translates hero text
7. Selecting Italian translates hero text
8. Selecting Chinese translates hero text
9. Language persists on page reload (localStorage)
10. Dropdown closes when clicking outside
11. Mobile viewport: dropdown still works at 390px width
12. Form placeholders update per language
"""

import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL = "https://code-ui.brightcone.ai"
WOW_URL  = f"{BASE_URL}/wow.html"

# Expected nav translations per language
NAV_EXPECT = {
    'fr': 'Philosophie',
    'es': 'Filosofía',
    'de': 'Philosophie',
    'it': 'Filosofia',
    'zh': '品牌哲学',
}

HERO_TAG_EXPECT = {
    'fr': 'gastronomie italienne',
    'es': 'gastronomía italiana',
    'de': 'italienischen Gastronomie',
    'it': 'gastronomia italiana',
    'zh': '意大利美食',
}


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


@pytest.fixture(scope="module")
def mobile_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=390,844")
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


def open_dropdown(driver):
    """Click the language selected button to open dropdown."""
    btn = wait(driver).until(EC.presence_of_element_located((By.ID, "langSelected")))
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", btn)
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.4)


def select_language(driver, lang_code):
    """Open dropdown and click the option for lang_code."""
    open_dropdown(driver)
    opt = wait(driver).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, f".lang-option[data-lang='{lang_code}']"))
    )
    driver.execute_script("arguments[0].click();", opt)
    time.sleep(0.8)


# ── Test 1: Dropdown button visible ──────────────────────────────────────────
def test_dropdown_button_visible(driver):
    go_to_wow(driver)
    btn = wait(driver).until(EC.presence_of_element_located((By.ID, "langSelected")))
    assert btn.is_displayed(), "Language selected button should be visible in nav"
    # Should show a flag and language label
    assert driver.find_element(By.ID, "langFlag").is_displayed()
    assert driver.find_element(By.ID, "langLabel").is_displayed()


# ── Test 2: Dropdown opens with options ───────────────────────────────────────
def test_dropdown_opens(driver):
    go_to_wow(driver)
    open_dropdown(driver)
    dropdown = driver.find_element(By.CLASS_NAME, "lang-dropdown")
    # Check it's visible (open class added)
    switcher = driver.find_element(By.ID, "langSwitcher")
    assert "open" in switcher.get_attribute("class"), "Switcher should have 'open' class when dropdown is open"


# ── Test 3: All 6 language options present ────────────────────────────────────
def test_all_six_languages_present(driver):
    go_to_wow(driver)
    open_dropdown(driver)
    langs = ['en', 'it', 'fr', 'es', 'de', 'zh']
    for lc in langs:
        opt = driver.find_element(By.CSS_SELECTOR, f".lang-option[data-lang='{lc}']")
        assert opt is not None, f"Language option '{lc}' should be present"


# ── Test 4: French translation ────────────────────────────────────────────────
def test_french_translation(driver):
    go_to_wow(driver)
    select_language(driver, 'fr')
    page = driver.page_source
    assert 'Philosophie' in page, "French: 'Philosophie' should appear in nav"
    assert 'gastronomie italienne' in page, "French: hero tag should reference 'gastronomie italienne'"
    assert 'Neuf Services' in page or 'Neuf' in page, "French: 'Neuf' courses should appear"
    assert 'Pérouse' in page, "French: city should be 'Pérouse'"
    # Flag should update
    flag = driver.find_element(By.ID, "langFlag")
    assert '🇫🇷' in flag.text, "French flag should show in dropdown button"


# ── Test 5: Spanish translation ───────────────────────────────────────────────
def test_spanish_translation(driver):
    go_to_wow(driver)
    select_language(driver, 'es')
    page = driver.page_source
    assert 'Filosofía' in page, "Spanish: 'Filosofía' should appear"
    assert 'gastronomía italiana' in page, "Spanish: hero should reference 'gastronomía italiana'"
    assert 'Nueve' in page, "Spanish: 'Nueve' (nine) courses should appear"
    flag = driver.find_element(By.ID, "langFlag")
    assert '🇪🇸' in flag.text, "Spanish flag should show"


# ── Test 6: German translation ────────────────────────────────────────────────
def test_german_translation(driver):
    go_to_wow(driver)
    select_language(driver, 'de')
    page = driver.page_source
    assert 'Philosophie' in page, "German: 'Philosophie' should appear"
    assert 'italienischen Gastronomie' in page, "German: hero tag should reference 'italienischen Gastronomie'"
    assert 'Neun' in page, "German: 'Neun' (nine) gänge should appear"
    assert 'Perugia, Italien' in page, "German: city should be 'Perugia, Italien'"
    flag = driver.find_element(By.ID, "langFlag")
    assert '🇩🇪' in flag.text, "German flag should show"


# ── Test 7: Italian translation still works ───────────────────────────────────
def test_italian_translation(driver):
    go_to_wow(driver)
    select_language(driver, 'it')
    page = driver.page_source
    assert 'Filosofia' in page, "Italian: 'Filosofia' should appear"
    assert 'gastronomia italiana' in page, "Italian hero tag intact"
    flag = driver.find_element(By.ID, "langFlag")
    assert '🇮🇹' in flag.text, "Italian flag should show"


# ── Test 8: Chinese translation still works ───────────────────────────────────
def test_chinese_translation(driver):
    go_to_wow(driver)
    select_language(driver, 'zh')
    page = driver.page_source
    assert '品牌哲学' in page, "Chinese: nav philosophy should show"
    assert '意大利美食' in page or '佩鲁贾' in page, "Chinese: Chinese characters should appear on page"
    flag = driver.find_element(By.ID, "langFlag")
    assert '🇨🇳' in flag.text, "Chinese flag should show"


# ── Test 9: Language persists on reload ───────────────────────────────────────
def test_language_persists_on_reload(driver):
    go_to_wow(driver)
    select_language(driver, 'fr')
    # Reload page
    driver.get(WOW_URL)
    time.sleep(2)
    page = driver.page_source
    assert 'Philosophie' in page, "French should persist after reload via localStorage"
    saved = driver.execute_script("return localStorage.getItem('wow_lang')")
    assert saved == 'fr', f"localStorage should have 'fr', got '{saved}'"


# ── Test 10: Dropdown closes on outside click ─────────────────────────────────
def test_dropdown_closes_on_outside_click(driver):
    go_to_wow(driver)
    open_dropdown(driver)
    switcher = driver.find_element(By.ID, "langSwitcher")
    assert "open" in switcher.get_attribute("class"), "Should be open"
    # Click somewhere else
    driver.execute_script("document.body.click()")
    time.sleep(0.3)
    switcher = driver.find_element(By.ID, "langSwitcher")
    assert "open" not in (switcher.get_attribute("class") or ""), "Dropdown should close on outside click"


# ── Test 11: Mobile viewport — dropdown works ─────────────────────────────────
def test_mobile_dropdown_works(mobile_driver):
    mobile_driver.get(WOW_URL)
    time.sleep(2)
    btn = wait(mobile_driver).until(EC.presence_of_element_located((By.ID, "langSelected")))
    assert btn.is_displayed(), "Language button should be visible on mobile"
    mobile_driver.execute_script("arguments[0].click();", btn)
    time.sleep(0.4)
    opt = mobile_driver.find_element(By.CSS_SELECTOR, ".lang-option[data-lang='fr']")
    mobile_driver.execute_script("arguments[0].click();", opt)
    time.sleep(0.8)
    page = mobile_driver.page_source
    assert 'Philosophie' in page, "French translation should work on mobile viewport"


# ── Test 12: Form placeholders update per language ────────────────────────────
def test_form_placeholders_update(driver):
    go_to_wow(driver)
    select_language(driver, 'de')
    fname = driver.find_element(By.ID, "bf-fname")
    assert fname.get_attribute("placeholder") == "Thomas", \
        f"German placeholder should be 'Thomas', got '{fname.get_attribute('placeholder')}'"

    select_language(driver, 'fr')
    fname2 = driver.find_element(By.ID, "bf-fname")
    assert fname2.get_attribute("placeholder") == "Jean-Pierre", \
        f"French placeholder should be 'Jean-Pierre', got '{fname2.get_attribute('placeholder')}'"

    select_language(driver, 'es')
    fname3 = driver.find_element(By.ID, "bf-fname")
    assert fname3.get_attribute("placeholder") == "Carlos", \
        f"Spanish placeholder should be 'Carlos', got '{fname3.get_attribute('placeholder')}'"
