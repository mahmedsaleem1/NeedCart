"""Loads test settings from `.env.test` (never printed or committed)."""
import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env.test")


def _get(key: str, default: str | None = None) -> str:
    value = os.getenv(key, default)
    if value is None:
        raise RuntimeError(f"Missing '{key}' in .env.test (see .env.test.example)")
    return value


BASE_URL = _get("BASE_URL", "http://localhost:5173")
API_URL = _get("API_URL", "http://localhost:8000")
FIREBASE_WEB_API_KEY = _get("FIREBASE_WEB_API_KEY")
MONGO_URI = _get("MONGO_URI")
BUYER_EMAIL = _get("BUYER_EMAIL")
BUYER_PASSWORD = _get("BUYER_PASSWORD")
SELLER_EMAIL = _get("SELLER_EMAIL")
SELLER_PASSWORD = _get("SELLER_PASSWORD")
SIGNUP_TEST_EMAIL = _get("SIGNUP_TEST_EMAIL")
SIGNUP_TEST_PASSWORD = _get("SIGNUP_TEST_PASSWORD")

SCREENSHOT_DIR = ROOT / "screenshots"
TEST_IMAGE = ROOT / "fixtures" / "test-image.png"
