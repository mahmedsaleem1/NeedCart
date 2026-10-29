"""MongoDB helpers: read OTPs, seed test data and clean it up.

Only records whose title starts with `STS-TEST` (or the dedicated test accounts)
are ever touched, because the database is shared with the real app data.
"""
import re
import time
from threading import Event
from datetime import datetime, timezone

from bson import ObjectId
from pymongo import MongoClient

from utils.config import MONGO_URI
from utils.test_data import PREFIX

_client = None
TEST_TITLE = {"$regex": f"^{re.escape(PREFIX)}"}


def get_db():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=15000)
    return _client.get_default_database()


def get_latest_otp(email: str, timeout: float = 10) -> str:
    """Return the OTP the backend stored for `email`, polling for up to `timeout` seconds."""
    deadline = time.monotonic() + timeout
    while True:
        doc = get_db().otps.find_one({"email": email.lower()}, sort=[("createdAt", -1)])
        if doc:
            return doc["otp"]
        if time.monotonic() > deadline:
            raise TimeoutError(f"No OTP found in MongoDB for {email}")
        Event().wait(0.5)  # short pause between DB polls (nothing to auto-wait on here)


def find_user(email: str):
    """Return the buyer or seller document for `email`, or None."""
    db = get_db()
    return db.buyers.find_one({"email": email.lower()}) or db.sellers.find_one({"email": email.lower()})


def mark_seller_verified(email: str) -> None:
    """Sellers must be approved by an admin before adding products; do that directly."""
    get_db().sellers.update_one({"email": email.lower()}, {"$set": {"is_verified": True}})


def insert_product(seller_email: str, title: str, category: str, price: int, stock: int = 5):
    """Insert a product straight into MongoDB (avoids a Cloudinary upload per product)."""
    seller = get_db().sellers.find_one({"email": seller_email.lower()})
    now = datetime.now(timezone.utc)
    doc = {
        "sellerId": seller["_id"],
        "title": title,
        "description": f"{title} - created by the automated test suite",
        "image": "https://placehold.co/300x200/png",
        "category": category,
        "price": price,
        "availableStock": stock,
        "createdAt": now,
        "updatedAt": now,
        "__v": 0,
    }
    return get_db().products.insert_one(doc).inserted_id


def insert_post(buyer_email: str, title: str, budget: int = 1000):
    """Insert an open post straight into MongoDB (avoids a Cloudinary upload)."""
    buyer = get_db().buyers.find_one({"email": buyer_email.lower()})
    now = datetime.now(timezone.utc)
    doc = {
        "buyerId": buyer["_id"],
        "title": title,
        "description": f"{title} - created by the automated test suite",
        "image": "https://placehold.co/300x200/png",
        "budget": budget,
        "status": "open",
        "createdAt": now,
        "updatedAt": now,
        "__v": 0,
    }
    return get_db().posts.insert_one(doc).inserted_id


def count_posts_with_title(title: str) -> int:
    return get_db().posts.count_documents({"title": title})


def delete_test_products() -> int:
    return get_db().products.delete_many({"title": TEST_TITLE}).deleted_count


def delete_test_posts() -> int:
    return get_db().posts.delete_many({"title": TEST_TITLE}).deleted_count


def delete_product_by_id(product_id: str) -> None:
    get_db().products.delete_one({"_id": ObjectId(product_id)})


def count_leftovers() -> dict:
    """How many STS-TEST records remain (used to prove the cleanup works)."""
    db = get_db()
    return {
        "products": db.products.count_documents({"title": TEST_TITLE}),
        "posts": db.posts.count_documents({"title": TEST_TITLE}),
    }


def delete_signup_user(email: str) -> None:
    """Remove the account created by the signup test from MongoDB.

    The Firebase user is removed separately by `firebase_auth.delete_firebase_user`.
    """
    db = get_db()
    email = email.lower()
    db.buyers.delete_many({"email": email})
    db.sellers.delete_many({"email": email})
    db.otps.delete_many({"email": email})
