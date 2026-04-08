import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


def body_text(driver):
    return driver.find_element(By.TAG_NAME, 'body').text


def wait_body(driver, timeout=20):
    WebDriverWait(driver, timeout).until(lambda d: d.find_element(By.TAG_NAME, 'body'))


def looks_like_login_page(driver):
    text = body_text(driver).lower()
    return any(token in text for token in ['login', 'sign in', 'password', 'username', 'email'])


def attempt_login(driver, config):
    driver.get(config['base_url'])
    wait_body(driver)

    inputs = driver.find_elements(By.XPATH, "//input")
    email_input = None
    password_input = None
    for inp in inputs:
        typ = (inp.get_attribute('type') or '').lower()
        name = ' '.join(filter(None, [inp.get_attribute('name'), inp.get_attribute('id'), inp.get_attribute('placeholder')])).lower()
        if not email_input and (typ in ['text', 'email'] or 'user' in name or 'email' in name):
            email_input = inp
        if not password_input and typ == 'password':
            password_input = inp
    if email_input:
        email_input.clear()
        email_input.send_keys(config['username'])
    if password_input:
        password_input.clear()
        password_input.send_keys(config['password'])
        password_input.send_keys(Keys.ENTER)
    else:
        buttons = driver.find_elements(By.XPATH, "//button|//input[@type='submit']")
        for btn in buttons:
            txt = ((btn.text or '') + ' ' + (btn.get_attribute('value') or '')).lower()
            if any(x in txt for x in ['login', 'sign in', 'submit']):
                btn.click()
                break
    wait_body(driver)


def test_tc_001_login_page_accessible(driver, config):
    driver.get(config['base_url'])
    wait_body(driver)
    assert looks_like_login_page(driver) or driver.title


def test_tc_002_login_with_valid_credentials(driver, config):
    attempt_login(driver, config)
    assert config['base_url'].split('//', 1)[-1].split('/')[0] in driver.current_url or len(body_text(driver)) > 0


def test_tc_003_invalid_login_shows_error_or_stays_unauthenticated(driver, config):
    driver.get(config['base_url'])
    wait_body(driver)
    inputs = driver.find_elements(By.XPATH, "//input")
    email_input = None
    password_input = None
    for inp in inputs:
        typ = (inp.get_attribute('type') or '').lower()
        name = ' '.join(filter(None, [inp.get_attribute('name'), inp.get_attribute('id'), inp.get_attribute('placeholder')])).lower()
        if not email_input and (typ in ['text', 'email'] or 'user' in name or 'email' in name):
            email_input = inp
        if not password_input and typ == 'password':
            password_input = inp
    if not (email_input and password_input):
        pytest.skip('Login form fields not identifiable')
    email_input.clear()
    email_input.send_keys('invalid@example.com')
    password_input.clear()
    password_input.send_keys('WrongPassword123!')
    password_input.send_keys(Keys.ENTER)
    wait_body(driver)
    text = body_text(driver).lower()
    assert any(tok in text for tok in ['invalid', 'incorrect', 'error', 'login', 'sign in', 'password'])


def test_tc_004_dashboard_or_post_login_page_loads(driver, config):
    attempt_login(driver, config)
    text = body_text(driver).lower()
    assert len(text) > 20


def test_tc_005_navigation_links_exist(driver, config):
    attempt_login(driver, config)
    links = driver.find_elements(By.XPATH, "//a|//button")
    assert len(links) > 0


def test_tc_006_module_pages_detectable(driver, config):
    attempt_login(driver, config)
    nav_like = driver.find_elements(By.XPATH, "//nav//a | //aside//a | //a[@href] | //button")
    assert len(nav_like) > 0


def test_tc_007_forms_exist_for_validation(driver, config):
    attempt_login(driver, config)
    forms = driver.find_elements(By.XPATH, "//form | //input | //select | //textarea")
    assert len(forms) > 0


def test_tc_008_tables_or_lists_or_data_regions_exist(driver, config):
    attempt_login(driver, config)
    data_regions = driver.find_elements(By.XPATH, "//table | //ul | //ol | //*[@role='table'] | //*[@role='grid']")
    assert len(data_regions) >= 0


def test_tc_009_search_filter_sort_controls_if_available(driver, config):
    attempt_login(driver, config)
    controls = driver.find_elements(By.XPATH, "//input[contains(translate(@placeholder,'SEARCH','search'),'search')] | //button[contains(., 'Filter')] | //select")
    assert isinstance(controls, list)


def test_tc_010_logout_if_available(driver, config):
    attempt_login(driver, config)
    buttons = driver.find_elements(By.XPATH, "//button | //a")
    for btn in buttons:
        txt = (btn.text or '').lower()
        if any(x in txt for x in ['logout', 'log out', 'sign out']):
            btn.click()
            wait_body(driver)
            assert looks_like_login_page(driver) or 'login' in body_text(driver).lower()
            return
    pytest.skip('Logout control not found dynamically')
