"""Comprehensive Selenium suite for Brightcone UI surface coverage.

This suite is intentionally organized around the real application pages/routes that
exist in this repository. It focuses on:
- Public page rendering
- Auth page rendering and basic validation states
- Protected route redirects
- CRM/report authenticated shells
- HR portal public/authenticated flows

Execution notes:
- Defaults to the deployed frontend unless BASE_URL is overridden.
- Uses a local Chrome/Chromium binary when available.
- Some authenticated flows auto-create disposable users via the live API.
"""

from __future__ import annotations

import os
import tempfile
import uuid
from dataclasses import dataclass
from typing import Callable

import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

BASE_URL = os.getenv('BASE_URL', 'https://code-ui.brightcone.ai').rstrip('/')
API_BASE_URL = os.getenv('API_BASE_URL', 'https://code-api.brightcone.ai').rstrip('/')
CHROME_BIN = os.getenv('CHROME_BIN', os.path.expanduser('~/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome'))
CHROMEDRIVER_BIN = os.getenv('CHROMEDRIVER_BIN', '').strip()
HEADLESS = os.getenv('HEADLESS', '1') != '0'
TIMEOUT = int(os.getenv('SELENIUM_TIMEOUT', '20'))


@dataclass
class UserSession:
    name: str
    email: str
    password: str
    token: str


@dataclass
class HRSession:
    name: str
    email: str
    password: str
    company_id: int
    token: str
    role: str


def build_driver() -> webdriver.Chrome:
    options = Options()
    if os.path.exists(CHROME_BIN):
        options.binary_location = CHROME_BIN
    if HEADLESS:
        options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-software-rasterizer')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-background-networking')
    options.add_argument('--disable-background-timer-throttling')
    options.add_argument('--disable-breakpad')
    options.add_argument('--disable-component-update')
    options.add_argument('--disable-renderer-backgrounding')
    options.add_argument('--disable-ipc-flooding-protection')
    options.add_argument('--remote-debugging-port=0')
    options.add_argument('--window-size=1440,1400')

    profile_dir = tempfile.mkdtemp(prefix='brightcone-selenium-profile-')
    cache_dir = tempfile.mkdtemp(prefix='brightcone-selenium-cache-')
    data_dir = tempfile.mkdtemp(prefix='brightcone-selenium-data-')
    options.add_argument(f'--user-data-dir={profile_dir}')
    options.add_argument(f'--disk-cache-dir={cache_dir}')
    options.add_argument(f'--data-path={data_dir}')

    if CHROMEDRIVER_BIN and os.path.exists(CHROMEDRIVER_BIN):
        service = Service(CHROMEDRIVER_BIN)
        return webdriver.Chrome(service=service, options=options)
    return webdriver.Chrome(options=options)


def wait_for_text(driver: webdriver.Chrome, text: str, timeout: int = TIMEOUT) -> None:
    WebDriverWait(driver, timeout).until(
        lambda d: text.lower() in d.find_element(By.TAG_NAME, 'body').text.lower()
    )


def body_text(driver: webdriver.Chrome) -> str:
    return driver.find_element(By.TAG_NAME, 'body').text


def open_page(driver: webdriver.Chrome, path: str) -> None:
    driver.get(f'{BASE_URL}{path}')


def find_input_by_placeholder(driver: webdriver.Chrome, placeholder: str):
    return driver.find_element(By.XPATH, f"//input[@placeholder={xpath_literal(placeholder)}]")


def find_button_by_text(driver: webdriver.Chrome, text: str):
    return driver.find_element(By.XPATH, f"//button[normalize-space()={xpath_literal(text)}]")


def xpath_literal(value: str) -> str:
    if '"' not in value:
        return f'"{value}"'
    if "'" not in value:
        return f"'{value}'"
    parts = value.split('"')
    return 'concat(' + ', '.join([f'"{part}"' if part else '""' for part in parts[:-1]] + ['\'"\'', f'"{parts[-1]}"']) + ')'


def unique_email(prefix: str) -> str:
    return f'{prefix}-{uuid.uuid4().hex[:10]}@example.com'


def register_api_user() -> UserSession:
    email = unique_email('brightcone-user')
    password = 'secret12345'
    name = 'Selenium User'
    response = requests.post(
        f'{API_BASE_URL}/auth/register',
        json={'name': name, 'email': email, 'password': password},
        timeout=20,
    )
    response.raise_for_status()
    data = response.json()
    return UserSession(name=name, email=email, password=password, token=data['access_token'])


def create_hr_company_and_admin() -> HRSession:
    company_email = unique_email('brightcone-company')
    admin_email = unique_email('brightcone-admin')
    password = 'secret12345'
    response = requests.post(
        f'{API_BASE_URL}/hr/auth/register-company',
        json={
            'company_name': f'Brightcone QA {uuid.uuid4().hex[:6]}',
            'company_email': company_email,
            'company_phone': '1234567890',
            'industry': 'QA',
            'admin_name': 'HR Admin',
            'admin_email': admin_email,
            'admin_password': password,
        },
        timeout=20,
    )
    response.raise_for_status()
    company_id = response.json()['company_id']

    login = requests.post(
        f'{API_BASE_URL}/hr/auth/login',
        json={'email': admin_email, 'password': password},
        timeout=20,
    )
    login.raise_for_status()
    data = login.json()
    return HRSession(
        name=data['name'],
        email=admin_email,
        password=password,
        company_id=company_id,
        token=data['access_token'],
        role=data['role'],
    )


def seed_web_auth(driver: webdriver.Chrome, user: UserSession) -> None:
    driver.execute_script("window.localStorage.setItem('token', arguments[0]);", user.token)


def seed_hr_auth(driver: webdriver.Chrome, session: HRSession) -> None:
    driver.execute_script(
        """
        window.localStorage.setItem('hr_token', arguments[0]);
        window.localStorage.setItem('hr_role', arguments[1]);
        window.localStorage.setItem('hr_name', arguments[2]);
        window.localStorage.setItem('hr_company_id', arguments[3]);
        """,
        session.token,
        session.role,
        session.name,
        str(session.company_id),
    )


def run_with_driver(assertions: Callable[[webdriver.Chrome], None]) -> None:
    driver = build_driver()
    try:
        assertions(driver)
    finally:
        driver.quit()


def test_public_routes_render_core_content():
    def assertions(driver: webdriver.Chrome):
        checks = [
            ('/', 'Build agent products teams actually use.'),
            ('/about', 'About Brightcone'),
            ('/pricing', 'Simple pricing for teams building with AI agents.'),
            ('/login', 'Welcome back'),
            ('/register', 'Create your account'),
            ('/forgot-password', 'Forgot password'),
            ('/reset-password', 'Invalid link'),
            ('/hr', 'HR Portal'),
        ]
        for path, expected in checks:
            open_page(driver, path)
            wait_for_text(driver, expected)
            assert expected in body_text(driver)
    run_with_driver(assertions)


def test_public_navigation_links_cover_key_pages():
    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/')
        driver.find_element(By.LINK_TEXT, 'Pricing').click()
        wait_for_text(driver, 'Pricing built for speed')
        driver.back()
        driver.find_element(By.LINK_TEXT, 'About').click()
        wait_for_text(driver, 'About Brightcone')
        driver.back()
        driver.find_element(By.LINK_TEXT, 'CRM').click()
        wait_for_text(driver, 'Welcome back')
        assert '/login' in driver.current_url
    run_with_driver(assertions)


def test_auth_pages_validate_and_transition():
    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/login')
        wait_for_text(driver, 'Welcome back')
        driver.find_element(By.LINK_TEXT, 'Forgot password?').click()
        wait_for_text(driver, 'Send reset link')
        driver.find_element(By.LINK_TEXT, 'Sign in').click()
        wait_for_text(driver, 'Continue')
        driver.find_element(By.LINK_TEXT, 'Create one').click()
        wait_for_text(driver, 'Create your account')
        assert 'Create account' in body_text(driver)
    run_with_driver(assertions)


def test_register_login_and_basic_chat_shell():
    def assertions(driver: webdriver.Chrome):
        email = unique_email('brightcone-ui-register')
        password = 'secret12345'
        open_page(driver, '/register')
        find_input_by_placeholder(driver, 'Your name').send_keys('UI Register User')
        find_input_by_placeholder(driver, 'you@example.com').send_keys(email)
        find_input_by_placeholder(driver, 'Choose a password').send_keys(password)
        find_button_by_text(driver, 'Create account').click()
        wait_for_text(driver, 'How can I help you today?')
        assert '/chat' in driver.current_url
        assert 'Message Brightcone...' in driver.page_source
    run_with_driver(assertions)


def test_login_invalid_credentials_error():
    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/login')
        find_input_by_placeholder(driver, 'you@example.com').send_keys('nobody@example.com')
        find_input_by_placeholder(driver, 'Enter your password').send_keys('wrongpass')
        find_button_by_text(driver, 'Continue').click()
        wait_for_text(driver, 'Invalid email or password')
    run_with_driver(assertions)


def test_forgot_password_known_email_flow_message():
    user = register_api_user()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/forgot-password')
        find_input_by_placeholder(driver, 'you@example.com').send_keys(user.email)
        find_button_by_text(driver, 'Send reset link').click()
        wait_for_text(driver, 'Check your email')
        assert user.email in body_text(driver)
    run_with_driver(assertions)


def test_protected_user_routes_redirect_when_unauthenticated():
    def assertions(driver: webdriver.Chrome):
        for path in ['/chat', '/crm', '/tickets', '/report']:
            open_page(driver, path)
            wait_for_text(driver, 'Welcome back')
            assert '/login' in driver.current_url
    run_with_driver(assertions)


def test_authenticated_chat_profile_and_signout():
    user = register_api_user()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/login')
        seed_web_auth(driver, user)
        open_page(driver, '/chat')
        wait_for_text(driver, 'How can I help you today?')
        assert 'Powered by Brightcone AI' in body_text(driver)
        driver.find_element(By.XPATH, "//button[contains(., 'Sign out')]").click()
        WebDriverWait(driver, TIMEOUT).until(lambda d: '/login' in d.current_url)
        assert '/login' in driver.current_url
    run_with_driver(assertions)


def test_authenticated_crm_flow_add_search_update_delete_and_outreach_tab():
    user = register_api_user()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/login')
        seed_web_auth(driver, user)
        open_page(driver, '/crm')
        wait_for_text(driver, 'Lead Management')
        driver.find_element(By.XPATH, "//button[contains(., 'Add Lead')]").click()
        find_input_by_placeholder(driver, 'Full name *').send_keys('Alice Prospect')
        find_input_by_placeholder(driver, 'Email address *').send_keys('alice@example.com')
        find_input_by_placeholder(driver, 'Company').send_keys('Acme')
        find_input_by_placeholder(driver, 'Deal value (e.g. $5,000)').send_keys('5000')
        find_button_by_text(driver, 'Add Lead').click()
        wait_for_text(driver, 'Alice Prospect')

        search = find_input_by_placeholder(driver, 'Search leads...')
        search.clear()
        search.send_keys('Alice')
        wait_for_text(driver, 'alice@example.com')

        select = Select(driver.find_element(By.XPATH, "//tr[.//span[contains(., 'Alice Prospect') or .//td[contains(., 'Alice Prospect')]]//select"))
        select.select_by_visible_text('Qualified')
        wait_for_text(driver, 'Qualified')

        driver.find_element(By.XPATH, "//button[contains(., 'Outreach History')]").click()
        wait_for_text(driver, 'No outreach emails sent yet.')

        driver.find_element(By.XPATH, "//button[contains(., 'Leads')]").click()
        wait_for_text(driver, 'Alice Prospect')
        driver.find_element(By.XPATH, "//tr[.//span[contains(., 'Alice Prospect') or .//td[contains(., 'Alice Prospect')]]//button[contains(., 'Delete')]").click()
        driver.find_element(By.XPATH, "//tr[.//span[contains(., 'Alice Prospect') or .//td[contains(., 'Alice Prospect')]]//button[contains(., 'Confirm')]").click()
        WebDriverWait(driver, TIMEOUT).until(lambda d: 'Alice Prospect' not in body_text(d))
    run_with_driver(assertions)


def test_authenticated_tickets_page_create_filter_update_and_delete():
    user = register_api_user()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/login')
        seed_web_auth(driver, user)
        open_page(driver, '/tickets')
        wait_for_text(driver, 'Ticket Management')
        wait_for_text(driver, 'Create Ticket')

        driver.find_element(By.XPATH, "//button[normalize-space()='Create Ticket']").click()
        find_input_by_placeholder(driver, 'Ticket title *').send_keys('API outage follow-up')
        find_input_by_placeholder(driver, 'Customer name *').send_keys('Acme Support')
        find_input_by_placeholder(driver, 'Category *').send_keys('Operations')
        note = driver.find_element(By.XPATH, "//textarea[@placeholder='Issue summary / support note']")
        note.send_keys('Customer reported retry failures after deployment window.')
        driver.find_element(By.XPATH, "//select").send_keys('High')
        driver.find_element(By.XPATH, "//button[normalize-space()='Create Ticket']").click()
        wait_for_text(driver, 'API outage follow-up')

        search = find_input_by_placeholder(driver, 'Search tickets...')
        search.clear()
        search.send_keys('API outage')
        wait_for_text(driver, 'Acme Support')

        status_select = Select(driver.find_element(By.XPATH, "//tr[.//p[contains(., 'API outage follow-up')]]//select"))
        status_select.select_by_visible_text('Resolved')
        wait_for_text(driver, 'Resolved')

        driver.find_element(By.XPATH, "//tr[.//p[contains(., 'API outage follow-up')]]//button[contains(., 'Delete')]").click()
        WebDriverWait(driver, TIMEOUT).until(lambda d: 'API outage follow-up' not in body_text(d))
    run_with_driver(assertions)


def test_authenticated_report_page_handles_empty_state():
    user = register_api_user()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/login')
        seed_web_auth(driver, user)
        open_page(driver, '/report')
        wait_for_text(driver, 'Outreach Activity Report')
        assert 'Loading report' in body_text(driver) or 'No outreach emails sent yet.' in body_text(driver) or 'Email Activity' in body_text(driver)
    run_with_driver(assertions)


def test_hr_public_page_tabs_and_company_registration():
    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/hr')
        wait_for_text(driver, 'HR Portal')
        driver.find_element(By.XPATH, "//button[normalize-space()='Register Company']").click()
        wait_for_text(driver, 'Company Details')
        suffix = uuid.uuid4().hex[:6]
        find_input_by_placeholder(driver, 'Company name *').send_keys(f'Selenium Co {suffix}')
        find_input_by_placeholder(driver, 'Company email *').send_keys(f'company-{suffix}@example.com')
        find_input_by_placeholder(driver, 'Phone').send_keys('9999999999')
        find_input_by_placeholder(driver, 'Industry').send_keys('QA')
        find_input_by_placeholder(driver, 'Admin full name *').send_keys('QA Admin')
        find_input_by_placeholder(driver, 'Admin email *').send_keys(f'admin-{suffix}@example.com')
        find_input_by_placeholder(driver, 'Admin password *').send_keys('secret12345')
        find_button_by_text(driver, 'Register Company').click()
        wait_for_text(driver, 'Company registered! You can now sign in as the company admin.')
    run_with_driver(assertions)


def test_hr_public_employee_registration_form_renders():
    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/hr')
        driver.find_element(By.XPATH, "//button[normalize-space()='Register Employee']").click()
        wait_for_text(driver, 'Company ID *')
        assert 'Register Employee' in body_text(driver)
    run_with_driver(assertions)


def test_hr_dashboard_redirects_when_unauthenticated():
    def assertions(driver: webdriver.Chrome):
        for path in ['/hr/dashboard', '/hr/companies', '/hr/employees', '/hr/attendance', '/hr/leave', '/hr/payslips', '/hr/reports', '/hr/profile']:
            open_page(driver, path)
            wait_for_text(driver, 'HR Portal')
            assert '/hr' in driver.current_url
    run_with_driver(assertions)


def test_hr_authenticated_admin_shell_pages():
    hr_session = create_hr_company_and_admin()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/hr')
        seed_hr_auth(driver, hr_session)
        protected_pages = [
            ('/hr/dashboard', 'Welcome back'),
            ('/hr/employees', 'Employees'),
            ('/hr/attendance', 'Attendance'),
            ('/hr/leave', 'Leave Management'),
            ('/hr/payslips', 'Payslips'),
            ('/hr/reports', 'Reports & Analytics'),
            ('/hr/profile', 'My Profile'),
        ]
        for path, expected in protected_pages:
            open_page(driver, path)
            wait_for_text(driver, expected)
            assert expected in body_text(driver)
    run_with_driver(assertions)


def test_hr_admin_can_add_employee_from_ui():
    hr_session = create_hr_company_and_admin()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/hr')
        seed_hr_auth(driver, hr_session)
        open_page(driver, '/hr/employees')
        wait_for_text(driver, 'Employees')
        driver.find_element(By.XPATH, "//button[contains(., '+ Add Employee')]").click()
        wait_for_text(driver, 'Add New Employee')
        suffix = uuid.uuid4().hex[:6]
        find_input_by_placeholder(driver, 'John Doe').send_keys('Employee One')
        find_input_by_placeholder(driver, 'john@company.com').send_keys(f'employee-{suffix}@example.com')
        find_input_by_placeholder(driver, 'Min 6 chars').send_keys('secret12345')
        find_input_by_placeholder(driver, 'Engineering').send_keys('Engineering')
        find_input_by_placeholder(driver, 'Software Engineer').send_keys('QA Engineer')
        find_input_by_placeholder(driver, '+91-9000000000').send_keys('9000000000')
        find_input_by_placeholder(driver, '50000').send_keys('50000')
        driver.find_element(By.XPATH, "//button[normalize-space()='Add Employee']").click()
        wait_for_text(driver, 'Employee added successfully!')
        wait_for_text(driver, 'Employee One')
    run_with_driver(assertions)


def test_hr_admin_leave_and_profile_pages_render_interactive_sections():
    hr_session = create_hr_company_and_admin()

    def assertions(driver: webdriver.Chrome):
        open_page(driver, '/hr')
        seed_hr_auth(driver, hr_session)
        open_page(driver, '/hr/leave')
        wait_for_text(driver, 'My Leave Requests')
        assert 'Apply Leave' in body_text(driver)
        open_page(driver, '/hr/profile')
        wait_for_text(driver, 'My Profile')
        assert 'Edit Profile' in body_text(driver)
    run_with_driver(assertions)
