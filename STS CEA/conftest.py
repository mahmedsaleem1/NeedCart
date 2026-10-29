# Owner: Shaheer & Ahmed (shared fixtures)
"""Shared fixtures for the whole suite."""
import re

import pytest
from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import expect

from pages.login_page import LoginPage
from utils import config as cfg
from utils import db
from utils.firebase_auth import get_id_token
from utils.test_data import SEEDED_PRODUCTS


# The backend talks to MongoDB Atlas, Firebase and Gmail, so allow slow answers.
expect.set_options(timeout=20_000)


# ---------------------------------------------------------------- settings / tokens
@pytest.fixture(scope="session")
def config():
    """The values loaded from .env.test."""
    return cfg


@pytest.fixture(scope="session")
def buyer_token():
    return get_id_token(cfg.BUYER_EMAIL, cfg.BUYER_PASSWORD)


@pytest.fixture(scope="session")
def seller_token():
    return get_id_token(cfg.SELLER_EMAIL, cfg.SELLER_PASSWORD)


# ---------------------------------------------------------------- API client
@pytest.fixture(scope="session")
def api(playwright):
    """Playwright APIRequestContext pointed at the backend (no browser involved)."""
    context = playwright.request.new_context(base_url=cfg.API_URL)
    yield context
    context.dispose()


# ---------------------------------------------------------------- test data
@pytest.fixture(scope="session", autouse=True)
def cleanup_test_records():
    """Safety net: remove any STS-TEST products/posts before and after the session."""
    db.delete_test_products()
    db.delete_test_posts()
    yield
    db.delete_test_products()
    db.delete_test_posts()


@pytest.fixture(scope="session")
def seeded_products(cleanup_test_records):
    """Three known products (Electronics, Books, Clothing) owned by the test seller.

    They are inserted straight into MongoDB so we do not upload 3 images to
    Cloudinary on every run; the API create flow is covered by TC-13 instead.
    """
    for title, category, price in SEEDED_PRODUCTS:
        db.insert_product(cfg.SELLER_EMAIL, title, category, price)
    yield [title for title, _, _ in SEEDED_PRODUCTS]
    db.delete_test_products()


# ---------------------------------------------------------------- browser helpers
@pytest.fixture(scope="session")
def buyer_storage_state(browser, browser_context_args, tmp_path_factory):
    """Log in as the buyer once through the UI and save the session to a file.

    Firebase keeps the user in IndexedDB, so we save it with indexed_db=True.
    """
    context = browser.new_context(**browser_context_args)
    page = context.new_page()
    page.on("dialog", lambda dialog: dialog.accept())
    # The real internet connection can drop a Firebase call now and then, so try up to 3 times.
    for attempt in range(3):
        LoginPage(page).open().login(cfg.BUYER_EMAIL, cfg.BUYER_PASSWORD)
        try:
            page.get_by_role("button", name="Buyer").wait_for(timeout=20_000)
            break
        except PlaywrightError:
            if attempt == 2:
                raise
    path = tmp_path_factory.mktemp("state") / "buyer.json"
    context.storage_state(path=str(path), indexed_db=True)
    context.close()
    return str(path)


@pytest.fixture
def logged_in_buyer_page(browser, browser_context_args, buyer_storage_state):
    """A fresh page that is already logged in as the buyer."""
    context = browser.new_context(**browser_context_args, storage_state=buyer_storage_state)
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture
def snap(browser_name, request):
    """snap(page, name) saves a full-page screenshot to screenshots/<browser>/<name>.png."""
    folder = browser_name
    if request.config.getoption("--device"):
        folder += "-mobile"

    def _snap(page, name):
        target = cfg.SCREENSHOT_DIR / folder
        target.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(target / f"{name}.png"), full_page=True)

    return _snap


@pytest.fixture
def fail_on_js_errors(page):
    """Fail the test if the page throws an uncaught JavaScript error."""
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    yield errors
    assert not errors, f"Uncaught JS errors on the page: {errors}"


