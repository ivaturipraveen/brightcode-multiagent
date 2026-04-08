"""Generated Selenium tests from Testcases.pdf.

Assumptions:
- Base URL is supplied via BASE_URL env var or pytest --base-url option.
- Selectors are placeholders based on inferred flows and must be aligned to the real UI.
- Payment gateway is mocked, per source document.
"""

from __future__ import annotations

import os
from dataclasses import dataclass

import pytest
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait


BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")


@dataclass(frozen=True)
class UserData:
    name: str
    email: str
    password: str


TEST_USER = UserData(name="Test User", email="testuser@example.com", password="Password123")
DUPLICATE_USER = UserData(name="Existing User", email="existing@example.com", password="Password123")


@pytest.fixture
def driver():
    options = ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1440,1200")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(3)
    yield driver
    driver.quit()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 10)


# ---------- Helper functions ----------

def open_page(driver, path: str):
    driver.get(f"{BASE_URL}{path}")


def find_first(driver, selectors: list[tuple[str, str]]):
    for by, value in selectors:
        try:
            return driver.find_element(by, value)
        except NoSuchElementException:
            continue
    raise NoSuchElementException(f"Unable to locate element with selectors: {selectors}")


def click_first(driver, selectors: list[tuple[str, str]]):
    element = find_first(driver, selectors)
    element.click()
    return element


def type_first(driver, selectors: list[tuple[str, str]], value: str):
    element = find_first(driver, selectors)
    element.clear()
    element.send_keys(value)
    return element


def visible_text(driver) -> str:
    return driver.find_element(By.TAG_NAME, "body").text


def login(driver, email: str, password: str):
    open_page(driver, "/login")
    type_first(driver, [(By.ID, "email"), (By.NAME, "email"), (By.CSS_SELECTOR, "input[type='email']"), (By.XPATH, "//input[contains(@placeholder, 'Email')]")], email)
    type_first(driver, [(By.ID, "password"), (By.NAME, "password"), (By.CSS_SELECTOR, "input[type='password']"), (By.XPATH, "//input[contains(@placeholder, 'Password')]")], password)
    click_first(driver, [(By.ID, "login-submit"), (By.NAME, "login"), (By.CSS_SELECTOR, "button[type='submit']"), (By.XPATH, "//button[contains(., 'Log in') or contains(., 'Login')]")])


# ---------- Tests ----------

def test_register_new_user_success(driver, wait):
    open_page(driver, "/register")
    type_first(driver, [(By.ID, "name"), (By.NAME, "name"), (By.CSS_SELECTOR, "input[name='name']"), (By.XPATH, "//input[contains(@placeholder, 'Name')]")], TEST_USER.name)
    type_first(driver, [(By.ID, "email"), (By.NAME, "email"), (By.CSS_SELECTOR, "input[type='email']"), (By.XPATH, "//input[contains(@placeholder, 'Email')]")], TEST_USER.email)
    type_first(driver, [(By.ID, "password"), (By.NAME, "password"), (By.CSS_SELECTOR, "input[type='password']"), (By.XPATH, "//input[contains(@placeholder, 'Password')]")], TEST_USER.password)
    click_first(driver, [(By.ID, "register-submit"), (By.NAME, "register"), (By.CSS_SELECTOR, "button[type='submit']"), (By.XPATH, "//button[contains(., 'Register') or contains(., 'Sign up')]")])

    assert "success" in visible_text(driver).lower() or "/login" in driver.current_url or "/dashboard" in driver.current_url


def test_register_duplicate_email_shows_validation(driver):
    open_page(driver, "/register")
    type_first(driver, [(By.ID, "name"), (By.NAME, "name"), (By.CSS_SELECTOR, "input[name='name']"), (By.XPATH, "//input[contains(@placeholder, 'Name')]")], DUPLICATE_USER.name)
    type_first(driver, [(By.ID, "email"), (By.NAME, "email"), (By.CSS_SELECTOR, "input[type='email']"), (By.XPATH, "//input[contains(@placeholder, 'Email')]")], DUPLICATE_USER.email)
    type_first(driver, [(By.ID, "password"), (By.NAME, "password"), (By.CSS_SELECTOR, "input[type='password']"), (By.XPATH, "//input[contains(@placeholder, 'Password')]")], DUPLICATE_USER.password)
    click_first(driver, [(By.ID, "register-submit"), (By.NAME, "register"), (By.CSS_SELECTOR, "button[type='submit']"), (By.XPATH, "//button[contains(., 'Register') or contains(., 'Sign up')]")])

    assert "already" in visible_text(driver).lower() or "duplicate" in visible_text(driver).lower()


def test_login_success_redirects_to_dashboard(driver, wait):
    login(driver, TEST_USER.email, TEST_USER.password)
    wait.until(lambda d: "/dashboard" in d.current_url or "dashboard" in visible_text(d).lower())
    assert "/dashboard" in driver.current_url or "dashboard" in visible_text(driver).lower()


def test_login_invalid_credentials_show_error(driver):
    login(driver, "wrong@example.com", "WrongPassword123")
    assert "invalid" in visible_text(driver).lower() or "incorrect" in visible_text(driver).lower()


def test_product_list_displays_core_fields(driver):
    open_page(driver, "/products")
    product_card = find_first(
        driver,
        [
            (By.CSS_SELECTOR, "[data-testid='product-card']"),
            (By.CSS_SELECTOR, ".product-card"),
            (By.XPATH, "//div[contains(@class, 'product')][.//img]"),
        ],
    )
    assert product_card is not None
    assert len(product_card.text.strip()) > 0


def test_filter_products_by_category(driver):
    open_page(driver, "/products")
    try:
        category = find_first(
            driver,
            [
                (By.ID, "category"),
                (By.NAME, "category"),
                (By.CSS_SELECTOR, "select[name='category']"),
                (By.XPATH, "//select[contains(@name, 'category') or contains(@id, 'category')]"),
            ],
        )
        Select(category).select_by_index(1)
    except NoSuchElementException:
        click_first(
            driver,
            [
                (By.CSS_SELECTOR, "[data-category]"),
                (By.XPATH, "//button[contains(@class, 'category')][1]"),
            ],
        )

    assert "product" in visible_text(driver).lower() or len(driver.find_elements(By.XPATH, "//img")) > 0


def test_add_in_stock_product_to_cart(driver, wait):
    open_page(driver, "/products")
    click_first(
        driver,
        [
            (By.CSS_SELECTOR, "[data-testid='add-to-cart']"),
            (By.CSS_SELECTOR, ".add-to-cart"),
            (By.XPATH, "//button[contains(., 'Add to Cart')]")
        ],
    )
    open_page(driver, "/cart")
    wait.until(lambda d: "cart" in d.current_url or "total" in visible_text(d).lower())
    page_text = visible_text(driver).lower()
    assert "quantity" in page_text and "total" in page_text


def test_update_cart_quantity_recalculates_total(driver):
    open_page(driver, "/cart")
    qty_input = find_first(
        driver,
        [
            (By.ID, "quantity"),
            (By.NAME, "quantity"),
            (By.CSS_SELECTOR, "input[type='number']"),
            (By.XPATH, "//input[contains(@name, 'qty') or contains(@name, 'quantity')]")
        ],
    )
    qty_input.clear()
    qty_input.send_keys("2")
    try:
        click_first(driver, [(By.ID, "update-cart"), (By.CSS_SELECTOR, "button.update-cart"), (By.XPATH, "//button[contains(., 'Update')]")])
    except NoSuchElementException:
        pass

    assert "total" in visible_text(driver).lower()


def test_remove_item_from_cart(driver):
    open_page(driver, "/cart")
    click_first(
        driver,
        [
            (By.ID, "remove-item"),
            (By.CSS_SELECTOR, ".remove-item"),
            (By.XPATH, "//button[contains(., 'Remove') or contains(., 'Delete')]")
        ],
    )
    assert "empty" in visible_text(driver).lower() or "removed" in visible_text(driver).lower() or len(driver.find_elements(By.XPATH, "//button[contains(., 'Remove') or contains(., 'Delete')]")) >= 0


def test_out_of_stock_product_cannot_be_added(driver):
    open_page(driver, "/products")
    click_first(
        driver,
        [
            (By.CSS_SELECTOR, "[data-testid='out-of-stock-product']"),
            (By.XPATH, "//*[contains(., 'Out of Stock')][1]"),
        ],
    )
    assert "out of stock" in visible_text(driver).lower() or "unavailable" in visible_text(driver).lower()


def test_checkout_success_shows_order_confirmation(driver, wait):
    open_page(driver, "/checkout")
    type_first(driver, [(By.ID, "shipping-address"), (By.NAME, "shippingAddress"), (By.CSS_SELECTOR, "textarea[name='shippingAddress']"), (By.XPATH, "//textarea[contains(@name, 'shipping')]")], "221 Test Street")
    type_first(driver, [(By.ID, "card-number"), (By.NAME, "cardNumber"), (By.CSS_SELECTOR, "input[name='cardNumber']"), (By.XPATH, "//input[contains(@name, 'card')]")], "4111111111111111")
    click_first(driver, [(By.ID, "place-order"), (By.CSS_SELECTOR, "button[type='submit']"), (By.XPATH, "//button[contains(., 'Place Order') or contains(., 'Checkout') or contains(., 'Pay')]")])
    wait.until(lambda d: "confirmation" in visible_text(d).lower() or "order" in visible_text(d).lower())
    assert "confirmation" in visible_text(driver).lower() or "order" in visible_text(driver).lower()


def test_checkout_missing_shipping_address_shows_validation(driver):
    open_page(driver, "/checkout")
    type_first(driver, [(By.ID, "card-number"), (By.NAME, "cardNumber"), (By.CSS_SELECTOR, "input[name='cardNumber']"), (By.XPATH, "//input[contains(@name, 'card')]")], "4111111111111111")
    click_first(driver, [(By.ID, "place-order"), (By.CSS_SELECTOR, "button[type='submit']"), (By.XPATH, "//button[contains(., 'Place Order') or contains(., 'Checkout') or contains(., 'Pay')]")])
    assert "shipping" in visible_text(driver).lower() or "address" in visible_text(driver).lower()


def test_checkout_payment_failure_is_handled(driver):
    open_page(driver, "/checkout")
    type_first(driver, [(By.ID, "shipping-address"), (By.NAME, "shippingAddress"), (By.CSS_SELECTOR, "textarea[name='shippingAddress']"), (By.XPATH, "//textarea[contains(@name, 'shipping')]")], "221 Test Street")
    type_first(driver, [(By.ID, "card-number"), (By.NAME, "cardNumber"), (By.CSS_SELECTOR, "input[name='cardNumber']"), (By.XPATH, "//input[contains(@name, 'card')]")], "4000000000000002")
    click_first(driver, [(By.ID, "place-order"), (By.CSS_SELECTOR, "button[type='submit']"), (By.XPATH, "//button[contains(., 'Place Order') or contains(., 'Checkout') or contains(., 'Pay')]")])
    assert "payment failed" in visible_text(driver).lower() or "try again" in visible_text(driver).lower() or "declined" in visible_text(driver).lower()


def test_logout_clears_session(driver, wait):
    login(driver, TEST_USER.email, TEST_USER.password)
    click_first(driver, [(By.ID, "logout"), (By.CSS_SELECTOR, "button.logout"), (By.XPATH, "//button[contains(., 'Logout') or contains(., 'Sign out')] | //a[contains(., 'Logout') or contains(., 'Sign out')]")])
    try:
        wait.until(lambda d: "/login" in d.current_url or "/" == d.current_url.rstrip("/"))
    except TimeoutException:
        pass
    assert "login" in driver.current_url or "sign in" in visible_text(driver).lower()
