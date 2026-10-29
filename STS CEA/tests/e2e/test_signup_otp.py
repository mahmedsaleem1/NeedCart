# Owner: Shaheer
"""Feature 2: Signup with OTP verification (TC-04 to TC-06).

The OTP normally arrives by email; the tests read it from MongoDB instead.
"""
import pytest
from playwright.sync_api import Page, expect

from pages.signup_page import SignupPage
from utils import config as cfg
from utils import db
from utils.firebase_auth import delete_firebase_user

pytestmark = pytest.mark.e2e


@pytest.fixture
def clean_otps():
    """Remove pending OTP rows for the signup test email before and after the test."""
    otps = db.get_db().otps
    otps.delete_many({"email": cfg.SIGNUP_TEST_EMAIL.lower()})
    yield
    otps.delete_many({"email": cfg.SIGNUP_TEST_EMAIL.lower()})


@pytest.fixture
def clean_signup_account(clean_otps):
    """Only for the test that really creates an account: delete it from MongoDB and Firebase."""

    def _clean():
        delete_firebase_user(cfg.SIGNUP_TEST_EMAIL)
        db.delete_signup_user(cfg.SIGNUP_TEST_EMAIL)

    _clean()
    yield
    _clean()


@pytest.mark.positive
def test_tc04_signup_with_valid_otp(page: Page, snap, clean_signup_account):
    """TC-04: A new buyer signs up, enters the correct OTP and the account is created.

    After a correct OTP the app shows a success message and sends the user to /login.
    We also check the buyer record really exists in MongoDB.
    """
    signup = SignupPage(page).open()
    signup.fill_form(cfg.SIGNUP_TEST_EMAIL, cfg.SIGNUP_TEST_PASSWORD, role="Buyer")
    signup.submit()
    expect(signup.otp_heading).to_be_visible()

    signup.enter_otp(db.get_latest_otp(cfg.SIGNUP_TEST_EMAIL))

    expect(page.get_by_text("Account created successfully!")).to_be_visible()
    snap(page, "tc04_signup_success")
    expect(page).to_have_url(f"{cfg.BASE_URL}/login")
    assert db.find_user(cfg.SIGNUP_TEST_EMAIL) is not None


@pytest.mark.negative
def test_tc05_invalid_email_format_is_rejected(page: Page, clean_otps):
    """TC-05: An email without '@' is rejected and no OTP screen appears.

    The email field is type=email, so the browser blocks the submit with a validation message.
    """
    signup = SignupPage(page).open()
    signup.fill_form("notanemail", cfg.SIGNUP_TEST_PASSWORD)
    signup.submit()

    assert signup.email.evaluate("el => el.validity.typeMismatch") is True
    expect(signup.otp_heading).to_have_count(0)
    expect(page).to_have_url(f"{cfg.BASE_URL}/signup")
    assert db.get_db().otps.count_documents({"email": cfg.SIGNUP_TEST_EMAIL.lower()}) == 0


@pytest.mark.negative
def test_tc06_wrong_otp_is_rejected(page: Page, clean_otps):
    """TC-06: Entering a wrong OTP ('000000') shows an error and creates no account.

    The error comes from the backend ('Invalid or expired OTP'); the user stays on the OTP screen.
    """
    signup = SignupPage(page).open()
    signup.fill_form(cfg.SIGNUP_TEST_EMAIL, cfg.SIGNUP_TEST_PASSWORD)
    signup.submit()
    expect(signup.otp_heading).to_be_visible()

    signup.enter_otp("000000")

    expect(page.get_by_text("Invalid or expired OTP").first).to_be_visible()
    expect(signup.otp_heading).to_be_visible()
    assert db.find_user(cfg.SIGNUP_TEST_EMAIL) is None
