from __future__ import annotations

import os
import tempfile
import time

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = os.getenv('BASE_URL', 'http://127.0.0.1:3000')
CHROME_BIN = os.getenv('CHROME_BIN', os.path.expanduser('~/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome'))


@pytest.fixture
def driver():
    options = Options()
    options.binary_location = CHROME_BIN
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1440,1200')
    user_data_dir = tempfile.mkdtemp(prefix='selenium-chrome-profile-')
    options.add_argument(f'--user-data-dir={user_data_dir}')
    service = Service(ChromeDriverManager(driver_version='141.0.7390.122', chrome_type='google-chrome').install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


def text(driver):
    return driver.find_element(By.TAG_NAME, 'body').text


def test_homepage_smoke(driver):
    driver.get(BASE_URL + '/')
    page = text(driver)
    assert 'Build agent products teams actually use.' in page
    assert 'Enterprise AI agents, designed with restraint' in page


def test_register_page_smoke(driver):
    driver.get(BASE_URL + '/register')
    page = text(driver)
    assert 'Create your account' in page
    assert 'Create account' in page


def test_login_invalid_credentials_shows_error(driver):
    driver.get(BASE_URL + '/login')
    inputs = driver.find_elements(By.TAG_NAME, 'input')
    assert len(inputs) >= 2
    email = inputs[0]
    password = inputs[1]
    email.send_keys(f'invalid-{int(time.time())}@example.com')
    password.send_keys('WrongPassword123')
    driver.find_element(By.TAG_NAME, 'button').click()
    wait = WebDriverWait(driver, 10)
    wait.until(lambda d: 'Invalid email or password' in text(d))
    assert 'Invalid email or password' in text(driver)


def test_protected_crm_redirects_to_login_without_token(driver):
    driver.get(BASE_URL + '/crm')
    wait = WebDriverWait(driver, 10)
    wait.until(lambda d: '/login' in d.current_url or 'Welcome back' in text(d))
    assert '/login' in driver.current_url or 'Welcome back' in text(driver)
