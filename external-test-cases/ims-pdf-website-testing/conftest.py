import os
import tempfile
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

BASE_URL = os.getenv('IMS_BASE_URL', 'https://staging-ims.ezmedtech.ai').rstrip('/')
USERNAME = os.getenv('IMS_USERNAME', 'saicharan+33@ezmedtech.ai')
PASSWORD = os.getenv('IMS_PASSWORD', 'Admin123!')
HEADLESS = os.getenv('HEADLESS', '1') != '0'
CHROME_BIN = os.getenv('CHROME_BIN', os.path.expanduser('~/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome'))
CHROMEDRIVER_BIN = os.getenv('CHROMEDRIVER_BIN', '').strip()

@pytest.fixture(scope='session')
def config():
    return {
        'base_url': BASE_URL,
        'username': USERNAME,
        'password': PASSWORD,
    }

@pytest.fixture
def driver():
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

    profile_dir = tempfile.mkdtemp(prefix='ims-selenium-profile-')
    cache_dir = tempfile.mkdtemp(prefix='ims-selenium-cache-')
    data_dir = tempfile.mkdtemp(prefix='ims-selenium-data-')
    options.add_argument(f'--user-data-dir={profile_dir}')
    options.add_argument(f'--disk-cache-dir={cache_dir}')
    options.add_argument(f'--data-path={data_dir}')

    if CHROMEDRIVER_BIN and os.path.exists(CHROMEDRIVER_BIN):
        service = Service(CHROMEDRIVER_BIN)
        drv = webdriver.Chrome(service=service, options=options)
    else:
        drv = webdriver.Chrome(options=options)

    drv.implicitly_wait(5)
    yield drv
    drv.quit()
