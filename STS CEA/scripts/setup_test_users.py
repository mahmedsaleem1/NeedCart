# Owner: Shaheer
"""One-time creation of the test buyer and seller through the app's REAL signup flow.

signup (API) -> read OTP from MongoDB -> verify-otp (API).
It is idempotent: users that already exist are skipped.

Run from the "STS CEA" folder:  python scripts/setup_test_users.py
"""
import sys
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from utils import config as cfg  # noqa: E402
from utils import db  # noqa: E402
from utils.firebase_auth import get_id_token  # noqa: E402


def can_login(email: str, password: str) -> bool:
    try:
        get_id_token(email, password)
        return True
    except requests.HTTPError:
        return False


def create_user(email: str, password: str, role: str) -> None:
    if can_login(email, password):
        print(f"[skip] {role} {email} already exists and can log in")
        return

    print(f"[..] signing up {role} {email}")
    resp = requests.post(
        f"{cfg.API_URL}/auth/signup",
        json={"email": email, "password": password, "role": role},
        timeout=60,
    )
    # The backend stores the OTP first and only then emails it. If the email step fails
    # (e.g. the Gmail app password is rejected) it answers 500, but the OTP is still in MongoDB.
    if not resp.ok and "Failed to send OTP email" not in resp.text:
        resp.raise_for_status()
    if not resp.ok:
        print("[warn] OTP email could not be sent (SMTP error); reading the OTP from MongoDB anyway")

    otp = db.get_latest_otp(email)
    resp = requests.post(
        f"{cfg.API_URL}/auth/verify-otp", json={"email": email, "otp": otp}, timeout=60
    )
    resp.raise_for_status()
    print(f"[ok] {role} {email} created")


def main() -> None:
    create_user(cfg.BUYER_EMAIL, cfg.BUYER_PASSWORD, "buyer")
    create_user(cfg.SELLER_EMAIL, cfg.SELLER_PASSWORD, "seller")

    # Sellers must be approved by an admin before they can add products.
    db.mark_seller_verified(cfg.SELLER_EMAIL)
    print("[ok] seller marked as verified")

    for email, password in (
        (cfg.BUYER_EMAIL, cfg.BUYER_PASSWORD),
        (cfg.SELLER_EMAIL, cfg.SELLER_PASSWORD),
    ):
        assert can_login(email, password), f"{email} cannot log in"
        print(f"[ok] {email} logs in")


if __name__ == "__main__":
    main()
