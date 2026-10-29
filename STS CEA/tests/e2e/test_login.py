# Owner: Shaheer
"""Feature 1: Login (TC-01 to TC-03)."""
import pytest
from playwright.sync_api import Page, expect

from pages.login_page import LoginPage
from utils import config as cfg

pytestmark = pytest.mark.e2e


@pytest.mark.positive
def test_tc01_valid_login_redirects_to_home(page: Page, snap):
    """TC-01: A valid buyer logs in and lands on the home page.

    The navbar must switch from Login/Sign Up to a 'Buyer' menu, proving the app
    recognises the user. (After login the app redirects to '/', not '/buyer'.)
    """
    LoginPage(page).open().login(cfg.BUYER_EMAIL, cfg.BUYER_PASSWORD)

    expect(page).to_have_url(f"{cfg.BASE_URL}/")
    expect(page.get_by_role("button", name="Buyer")).to_be_visible()
    expect(page.get_by_role("link", name="Login")).to_have_count(0)
    snap(page, "tc01_login_success")


@pytest.mark.negative
def test_tc02_wrong_password_shows_error(page: Page):
    """TC-02: A correct email with a wrong password is rejected.

    The app reports Firebase's error in an alert box and keeps the user on /login.
    """
    login = LoginPage(page).open()
    with page.expect_event("dialog") as dialog_info:
        login.login(cfg.BUYER_EMAIL, "definitely-the-wrong-password")
    dialog = dialog_info.value
    message = dialog.message
    dialog.accept()

    # Firebase answers invalid-credential; after many failed tries in a row it may answer
    # too-many-requests instead. Both mean the login was rejected.
    assert "auth/invalid-credential" in message or "auth/too-many-requests" in message
    expect(page).to_have_url(f"{cfg.BASE_URL}/login")
    expect(page.get_by_role("button", name="Buyer")).to_have_count(0)


@pytest.mark.negative
def test_tc03_empty_form_is_blocked(page: Page):
    """TC-03: Submitting an empty form does nothing.

    The browser's built-in 'required' validation stops the submit, so there is no
    navigation and no alert.
    """
    dialogs = []
    page.on("dialog", lambda d: (dialogs.append(d.message), d.accept()))
    login = LoginPage(page).open()
    login.submit_button.click()

    expect(page).to_have_url(f"{cfg.BASE_URL}/login")
    assert login.email.evaluate("el => el.validity.valueMissing") is True
    assert login.password.evaluate("el => el.validity.valueMissing") is True
    assert dialogs == []
