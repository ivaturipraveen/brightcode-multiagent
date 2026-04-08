"""Selenium tests for deployed Brightcone public and access-control routes.

Target:
- https://code-ui.brightcone.ai

Note:
- This suite is written for real browser execution.
- It uses locator strategies that match the current deployed Brightcone UI text.
"""

from __future__ import annotations

import os

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = os.getenv('BASE_URL', 'https://code-ui.brightcone.ai')
CHROME_BIN = os.getenv('CHROME_BIN', os.path.expanduser('~/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome'))


def build_driver() -> webdriver.Chrome:
    options = Options()
    if os.path.exists(CHROME_BIN):
        options.binary_location = CHROME_BIN
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1440,1200')
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)


def visible_text(driver: webdriver.Chrome) -> str:
    return driver.find_element(By.TAG_NAME, 'body').text


def test_homepage_renders_core_sections():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/')
        page = visible_text(driver)
        assert 'Build agent products teams actually use.' in page
        assert 'Enterprise AI agents, designed with restraint' in page
    finally:
        driver.quit()


def test_about_page_renders_story_sections():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/about')
        page = visible_text(driver)
        assert 'Built for teams who take' in page
        assert 'Our Mission' in page
    finally:
        driver.quit()


def test_pricing_page_renders_tiers():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/pricing')
        page = visible_text(driver)
        assert 'Starter' in page
        assert 'Pro' in page
        assert 'Enterprise' in page
    finally:
        driver.quit()


def test_login_page_renders():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/login')
        page = visible_text(driver)
        assert 'Welcome back' in page
        assert 'Continue' in page
    finally:
        driver.quit()


def test_hr_portal_renders():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/hr')
        page = visible_text(driver)
        assert 'HR Portal' in page
        assert 'Register Company' in page
        assert 'Register Employee' in page
    finally:
        driver.quit()


def test_unauthenticated_crm_redirects_to_login():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/crm')
        assert '/login' in driver.current_url or 'Welcome back' in visible_text(driver)
    finally:
        driver.quit()


def test_unauthenticated_chat_redirects_to_login():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/chat')
        assert '/login' in driver.current_url or 'Welcome back' in visible_text(driver)
    finally:
        driver.quit()


def test_unauthenticated_report_redirects_to_login():
    driver = build_driver()
    try:
        driver.get(BASE_URL + '/report')
        assert '/login' in driver.current_url or 'Welcome back' in visible_text(driver)
    finally:
        driver.quit()
