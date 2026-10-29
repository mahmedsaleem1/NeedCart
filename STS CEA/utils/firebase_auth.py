"""Talks to Firebase through its public REST API (no Admin SDK needed)."""
import subprocess

import requests

from utils.config import FIREBASE_WEB_API_KEY, ROOT

_BASE = "https://identitytoolkit.googleapis.com/v1/accounts"


def get_id_token(email: str, password: str) -> str:
    """Sign in with email/password and return a Firebase ID token."""
    resp = requests.post(
        f"{_BASE}:signInWithPassword",
        params={"key": FIREBASE_WEB_API_KEY},
        json={"email": email, "password": password, "returnSecureToken": True},
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()["idToken"]


def delete_firebase_user(email: str) -> bool:
    """Delete a Firebase user by email (clean-up after the signup test).

    The REST API can only delete the signed-in user and Firebase rate-limits sign-ins, so we
    reuse the backend's Admin SDK setup through a tiny Node script. Returns True if deleted.
    """
    result = subprocess.run(
        ["node", str(ROOT / "scripts" / "delete_firebase_user.mjs"), email],
        cwd=ROOT.parent / "Backend",
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=60,
    )
    return result.stdout.strip().endswith("deleted") and "not-found" not in result.stdout
