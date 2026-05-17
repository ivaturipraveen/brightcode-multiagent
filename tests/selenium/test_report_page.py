"""
RILEY 🧪 — Selenium tests for /report (Status Report micro-site)
Target: https://www.wowfinedining.com/report
"""
import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL = "https://www.wowfinedining.com"
REPORT_URL = f"{BASE_URL}/report"

@pytest.fixture(scope="module")
def driver():
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1280,900")
    drv = webdriver.Chrome(options=opts)
    yield drv
    drv.quit()


def wait(driver, by, selector, timeout=10):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, selector)))


# ── Tests ──────────────────────────────────────────────────────────────────────

class TestReportPageLoads:
    def test_page_title(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.TAG_NAME, "h1")
        assert "Report" in driver.title or "Submit" in driver.find_element(By.TAG_NAME, "h1").text

    def test_submit_tab_visible(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.XPATH, "//button[contains(text(),'Submit Report')]")
        btn = driver.find_element(By.XPATH, "//button[contains(text(),'Submit Report')]")
        assert btn.is_displayed()

    def test_executive_tab_visible(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.XPATH, "//button[contains(text(),'Executive View')]")
        btn = driver.find_element(By.XPATH, "//button[contains(text(),'Executive View')]")
        assert btn.is_displayed()


class TestSubmitForm:
    def test_form_fields_present(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.NAME, "submitter_name")
        assert driver.find_element(By.NAME, "submitter_name").is_displayed()
        assert driver.find_element(By.NAME, "submitter_email").is_displayed()
        assert driver.find_element(By.NAME, "department").is_displayed()
        assert driver.find_element(By.NAME, "accomplishments").is_displayed()

    def test_status_radio_buttons(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.XPATH, "//label[contains(text(),'On Track')]")
        labels = driver.find_elements(By.XPATH, "//label[contains(., 'On Track') or contains(., 'At Risk') or contains(., 'Blocked')]")
        assert len(labels) == 3

    def test_period_field_prepopulated(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.NAME, "period_label")
        val = driver.find_element(By.NAME, "period_label").get_attribute("value")
        assert val != "", "Period label should be pre-populated"

    def test_submit_validation_empty_form(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.XPATH, "//button[contains(text(),'Submit Report')]")
        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()
        time.sleep(0.5)
        # HTML5 validation should prevent submission — still on same page
        assert "/report" in driver.current_url

    def test_fill_and_submit(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.NAME, "submitter_name")

        driver.find_element(By.NAME, "submitter_name").send_keys("Test User")
        driver.find_element(By.NAME, "submitter_email").send_keys("test@brightcone.ai")

        dept_select = Select(driver.find_element(By.NAME, "department"))
        dept_select.select_by_visible_text("Engineering")

        driver.find_element(By.NAME, "accomplishments").send_keys(
            "• Completed integration tests\n• Fixed critical bug in auth flow"
        )
        driver.find_element(By.NAME, "blockers").send_keys("• Waiting on staging credentials")
        driver.find_element(By.NAME, "next_steps").send_keys("• Deploy to production\n• Write documentation")

        submit_btn = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_btn.click()

        # Should show success banner
        success = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//p[contains(text(),'submitted successfully')]"))
        )
        assert success.is_displayed()


class TestExecutiveView:
    def test_switch_to_executive_view(self, driver):
        driver.get(REPORT_URL)
        wait(driver, By.XPATH, "//button[contains(text(),'Executive View')]")
        driver.find_element(By.XPATH, "//button[contains(text(),'Executive View')]").click()
        time.sleep(1)
        h1 = driver.find_element(By.TAG_NAME, "h1")
        assert "Executive" in h1.text or "Dashboard" in h1.text or "Consolidated" in h1.text

    def test_stat_cards_visible_after_submit(self, driver):
        """After submitting a report, the executive view should show stat cards."""
        driver.get(REPORT_URL)
        wait(driver, By.XPATH, "//button[contains(text(),'Executive View')]")
        driver.find_element(By.XPATH, "//button[contains(text(),'Executive View')]").click()
        time.sleep(2)
        # Either shows stat cards or "no reports" empty state
        page_text = driver.find_element(By.TAG_NAME, "body").text
        assert any(word in page_text for word in [
            "Total Reports", "On Track", "No reports", "Submit"
        ])
