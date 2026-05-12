"""
Selenium integration tests for the BART Transit Portal (/bart)
Target: https://www.wowfinedining.com/bart
Run:    pytest tests/selenium/test_bart_page.py -v
Requires: pip install selenium pytest
          ChromeDriver installed and in PATH
"""

import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "https://www.wowfinedining.com/bart"
WAIT = 10  # seconds


@pytest.fixture(scope="module")
def driver():
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1280,900")
    d = webdriver.Chrome(options=opts)
    d.implicitly_wait(WAIT)
    yield d
    d.quit()


def wait_for(driver, by, value, timeout=WAIT):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((by, value))
    )


# ─── Page Load ──────────────────────────────────────────────────────────────

class TestPageLoad:
    def test_page_loads(self, driver):
        driver.get(BASE_URL)
        assert "bart" in driver.current_url.lower()

    def test_bart_header_visible(self, driver):
        driver.get(BASE_URL)
        header = wait_for(driver, By.XPATH, "//*[contains(text(), 'Bay Area Rapid Transit')]")
        assert header.is_displayed()

    def test_bart_logo_visible(self, driver):
        driver.get(BASE_URL)
        logo = wait_for(driver, By.XPATH, "//*[contains(text(), 'BART')]")
        assert logo.is_displayed()

    def test_service_alert_banner_visible(self, driver):
        driver.get(BASE_URL)
        alert = wait_for(driver, By.XPATH, "//*[contains(text(), 'SERVICE ALERT')]")
        assert alert.is_displayed()

    def test_service_alert_dismissible(self, driver):
        driver.get(BASE_URL)
        close_btn = wait_for(driver, By.XPATH, "//button[contains(text(), '×')]")
        close_btn.click()
        time.sleep(0.5)
        alerts = driver.find_elements(By.XPATH, "//*[contains(text(), 'SERVICE ALERT')]")
        assert len(alerts) == 0 or not alerts[0].is_displayed()

    def test_footer_visible(self, driver):
        driver.get(BASE_URL)
        footer = wait_for(driver, By.XPATH, "//*[contains(text(), 'Bay Area Rapid Transit District')]")
        assert footer.is_displayed()


# ─── Tab Navigation ─────────────────────────────────────────────────────────

class TestTabNavigation:
    TABS = [
        ("Trip Planner", "Plan Your Trip"),
        ("Real-Time",    "Real-Time Departures"),
        ("Train Lines",  "Train Lines & Schedules"),
        ("Bus Routes",   "Bus Routes"),
        ("Fares",        "Fares & Tickets"),
    ]

    def _click_tab(self, driver, tab_text):
        tab = WebDriverWait(driver, WAIT).until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(text(), '{tab_text}')]"))
        )
        tab.click()
        time.sleep(0.4)

    def test_trip_planner_tab(self, driver):
        driver.get(BASE_URL)
        self._click_tab(driver, "Trip Planner")
        heading = wait_for(driver, By.XPATH, "//*[contains(text(), 'Plan Your Trip')]")
        assert heading.is_displayed()

    def test_realtime_tab(self, driver):
        driver.get(BASE_URL)
        self._click_tab(driver, "Real-Time")
        heading = wait_for(driver, By.XPATH, "//*[contains(text(), 'Real-Time Departures')]")
        assert heading.is_displayed()

    def test_train_lines_tab(self, driver):
        driver.get(BASE_URL)
        self._click_tab(driver, "Train Lines")
        heading = wait_for(driver, By.XPATH, "//*[contains(text(), 'Train Lines')]")
        assert heading.is_displayed()

    def test_bus_routes_tab(self, driver):
        driver.get(BASE_URL)
        self._click_tab(driver, "Bus Routes")
        heading = wait_for(driver, By.XPATH, "//*[contains(text(), 'Bus Routes')]")
        assert heading.is_displayed()

    def test_fares_tab(self, driver):
        driver.get(BASE_URL)
        self._click_tab(driver, "Fares")
        heading = wait_for(driver, By.XPATH, "//*[contains(text(), 'Fares & Tickets')]")
        assert heading.is_displayed()


# ─── Trip Planner ───────────────────────────────────────────────────────────

class TestTripPlanner:
    def _go_to_planner(self, driver):
        driver.get(BASE_URL)
        tab = WebDriverWait(driver, WAIT).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Trip Planner')]"))
        )
        tab.click()
        time.sleep(0.3)

    def test_from_station_dropdown_present(self, driver):
        self._go_to_planner(driver)
        selects = driver.find_elements(By.TAG_NAME, "select")
        assert len(selects) >= 2

    def test_search_with_valid_stations_shows_results(self, driver):
        self._go_to_planner(driver)
        selects = driver.find_elements(By.TAG_NAME, "select")
        Select(selects[0]).select_by_visible_text("Embarcadero")
        Select(selects[1]).select_by_visible_text("Fremont")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Find Trips')]").click()
        time.sleep(0.5)
        result = wait_for(driver, By.XPATH, "//*[contains(text(), 'Embarcadero')]")
        assert result.is_displayed()

    def test_find_trips_button_present(self, driver):
        self._go_to_planner(driver)
        btn = wait_for(driver, By.XPATH, "//button[contains(text(), 'Find Trips')]")
        assert btn.is_displayed()

    def test_trip_type_selector_present(self, driver):
        self._go_to_planner(driver)
        selects = driver.find_elements(By.TAG_NAME, "select")
        options_found = any(
            "Depart" in s.text or "Arrive" in s.text
            for s in selects
        )
        assert options_found

    def test_date_input_present(self, driver):
        self._go_to_planner(driver)
        date_input = driver.find_element(By.CSS_SELECTOR, "input[type='date']")
        assert date_input.is_displayed()

    def test_quick_links_visible(self, driver):
        self._go_to_planner(driver)
        for text in ["System Map", "Clipper Card", "Accessibility", "Parking"]:
            el = wait_for(driver, By.XPATH, f"//*[contains(text(), '{text}')]")
            assert el.is_displayed()


# ─── Real-Time Departures ────────────────────────────────────────────────────

class TestRealTime:
    def _go_to_realtime(self, driver):
        driver.get(BASE_URL)
        tab = WebDriverWait(driver, WAIT).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Real-Time')]"))
        )
        tab.click()
        time.sleep(0.3)

    def test_departure_board_visible(self, driver):
        self._go_to_realtime(driver)
        board = wait_for(driver, By.XPATH, "//*[contains(text(), 'DESTINATION')]")
        assert board.is_displayed()

    def test_live_indicator_visible(self, driver):
        self._go_to_realtime(driver)
        live = wait_for(driver, By.XPATH, "//*[contains(text(), 'Live')]")
        assert live.is_displayed()

    def test_departure_rows_present(self, driver):
        self._go_to_realtime(driver)
        rows = driver.find_elements(By.XPATH, "//*[contains(text(), 'min')]")
        assert len(rows) >= 4

    def test_system_status_panel_visible(self, driver):
        self._go_to_realtime(driver)
        status = wait_for(driver, By.XPATH, "//*[contains(text(), 'System Status')]")
        assert status.is_displayed()

    def test_all_five_lines_in_status(self, driver):
        self._go_to_realtime(driver)
        for line in ["red", "yellow", "blue", "green", "orange"]:
            el = wait_for(driver, By.XPATH, f"//*[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'), '{line} line')]")
            assert el.is_displayed()


# ─── Train Lines ─────────────────────────────────────────────────────────────

class TestTrainLines:
    def _go_to_schedules(self, driver):
        driver.get(BASE_URL)
        tab = WebDriverWait(driver, WAIT).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Train Lines')]"))
        )
        tab.click()
        time.sleep(0.3)

    def test_five_train_lines_listed(self, driver):
        self._go_to_schedules(driver)
        lines = [
            "Richmond", "Antioch", "Dublin", "Berryessa"
        ]
        for name in lines:
            el = wait_for(driver, By.XPATH, f"//*[contains(text(), '{name}')]")
            assert el.is_displayed()

    def test_line_expands_on_click(self, driver):
        self._go_to_schedules(driver)
        # Click the first line card
        line_card = wait_for(driver, By.XPATH, "//div[contains(text(), 'Richmond – Daly City')]")
        line_card.click()
        time.sleep(0.4)
        timetable_btn = wait_for(driver, By.XPATH, "//button[contains(text(), 'Full Timetable')]")
        assert timetable_btn.is_displayed()

    def test_line_collapses_on_second_click(self, driver):
        self._go_to_schedules(driver)
        line_card = wait_for(driver, By.XPATH, "//div[contains(text(), 'Richmond – Daly City')]")
        line_card.click()
        time.sleep(0.3)
        line_card.click()
        time.sleep(0.3)
        btns = driver.find_elements(By.XPATH, "//button[contains(text(), 'Full Timetable')]")
        assert len(btns) == 0 or not btns[0].is_displayed()


# ─── Bus Routes ──────────────────────────────────────────────────────────────

class TestBusRoutes:
    def _go_to_bus(self, driver):
        driver.get(BASE_URL)
        tab = WebDriverWait(driver, WAIT).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Bus Routes')]"))
        )
        tab.click()
        time.sleep(0.3)

    def test_bus_routes_listed(self, driver):
        self._go_to_bus(driver)
        for route in ["72", "51A", "232", "45"]:
            el = wait_for(driver, By.XPATH, f"//*[contains(text(), '{route}')]")
            assert el.is_displayed()

    def test_bus_route_expands_on_click(self, driver):
        self._go_to_bus(driver)
        route_card = wait_for(driver, By.XPATH, "//*[contains(text(), 'East Oakland')]")
        route_card.click()
        time.sleep(0.4)
        btn = wait_for(driver, By.XPATH, "//button[contains(text(), 'Full Schedule')]")
        assert btn.is_displayed()

    def test_live_tracking_button_in_expanded_bus(self, driver):
        self._go_to_bus(driver)
        route_card = wait_for(driver, By.XPATH, "//*[contains(text(), 'East Oakland')]")
        route_card.click()
        time.sleep(0.4)
        btn = wait_for(driver, By.XPATH, "//button[contains(text(), 'Live Tracking')]")
        assert btn.is_displayed()


# ─── Fares & Tickets ─────────────────────────────────────────────────────────

class TestFares:
    def _go_to_fares(self, driver):
        driver.get(BASE_URL)
        tab = WebDriverWait(driver, WAIT).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Fares')]"))
        )
        tab.click()
        time.sleep(0.3)

    def test_fare_table_visible(self, driver):
        self._go_to_fares(driver)
        adult = wait_for(driver, By.XPATH, "//*[contains(text(), 'Adult Clipper')]")
        assert adult.is_displayed()

    def test_all_fare_types_visible(self, driver):
        self._go_to_fares(driver)
        for fare in ["Adult Clipper", "Senior / Disabled", "Youth", "Monthly Pass"]:
            el = wait_for(driver, By.XPATH, f"//*[contains(text(), '{fare}')]")
            assert el.is_displayed()

    def test_clipper_card_section_visible(self, driver):
        self._go_to_fares(driver)
        clipper = wait_for(driver, By.XPATH, "//*[contains(text(), 'Clipper Card')]")
        assert clipper.is_displayed()

    def test_get_clipper_card_button_present(self, driver):
        self._go_to_fares(driver)
        btn = wait_for(driver, By.XPATH, "//button[contains(text(), 'Get Clipper Card')]")
        assert btn.is_displayed()

    def test_buy_ticket_form_visible(self, driver):
        self._go_to_fares(driver)
        btn = wait_for(driver, By.XPATH, "//button[contains(text(), 'Proceed to Checkout')]")
        assert btn.is_displayed()

    def test_ticket_type_dropdown_has_options(self, driver):
        self._go_to_fares(driver)
        selects = driver.find_elements(By.TAG_NAME, "select")
        ticket_select = None
        for s in selects:
            if "Adult One-Way" in s.text:
                ticket_select = s
                break
        assert ticket_select is not None
        opts = Select(ticket_select).options
        assert len(opts) >= 4

    def test_quantity_input_present(self, driver):
        self._go_to_fares(driver)
        qty = driver.find_element(By.CSS_SELECTOR, "input[type='number']")
        assert qty.is_displayed()
        assert qty.get_attribute("value") == "1"
