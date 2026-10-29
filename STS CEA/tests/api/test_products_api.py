# Owner: Shaheer
"""Products API tests (TC-13 to TC-16) using Playwright's APIRequestContext.

Real routes (no /api prefix, no PUT/DELETE verbs):
    POST /product/add            (seller token, multipart with image)   -> create
    GET  /product/getOne/:id     (public)                               -> read
    POST /product/remove/:id     (seller token)                         -> delete
    PATCH /buyer-dashboard/posts/:id/status  (buyer token)              -> update (see TC-15)

These tests never open a browser, so they run once (not once per browser).
"""
import pytest

from utils import config as cfg
from utils import db
from utils.test_data import unique_name

pytestmark = pytest.mark.api

MISSING_ID = "64b7f0f0f0f0f0f0f0f0f0f0"  # valid ObjectId format, no such product


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def create_product(api, token, title, price="999"):
    """POST /product/add with a tiny PNG (the backend uploads it to Cloudinary)."""
    return api.post(
        "/product/add",
        headers=auth(token),
        multipart={
            "title": title,
            "description": "Created by the automated API tests",
            "category": "Electronics",
            "price": price,
            "availableStock": "3",
            "image": {
                "name": "test-image.png",
                "mimeType": "image/png",
                "buffer": cfg.TEST_IMAGE.read_bytes(),
            },
        },
    )


@pytest.fixture(scope="module", autouse=True)
def cleanup_products():
    """Remove every STS-TEST product at the end, even if a test failed midway."""
    yield
    db.delete_test_products()


@pytest.fixture(scope="module")
def shared_product(api, seller_token):
    """One product (created through the API) shared by the read-only tests."""
    response = create_product(api, seller_token, unique_name("API Shared Product"))
    assert response.status == 201, response.text()
    return response.json()["data"]


def test_tc13_create_product(api, seller_token):
    """TC-13 (Create): A verified seller can POST a product and gets 201 with the saved data.

    Also checks that the same POST without a token is refused (auth is enforced).
    """
    title = unique_name("API Product")
    response = create_product(api, seller_token, title, price="1234")

    assert response.status == 201, response.text()
    body = response.json()
    assert body["success"] is True
    assert body["data"]["_id"]
    assert body["data"]["title"] == title
    assert body["data"]["price"] == 1234

    no_token = api.post("/product/add", multipart={"title": title})
    assert no_token.status in (401, 403)


def test_tc14_read_product(api, shared_product):
    """TC-14 (Read): GET by id returns the product; a valid-format but unknown id returns 404."""
    response = api.get(f"/product/getOne/{shared_product['_id']}")
    assert response.status == 200
    data = response.json()["data"]
    assert data["_id"] == shared_product["_id"]
    assert data["title"] == shared_product["title"]

    missing = api.get(f"/product/getOne/{MISSING_ID}")
    assert missing.status == 404
    assert missing.json()["message"] == "Product not found"


@pytest.mark.xfail(
    reason="BUG-01: a malformed product id returns 500 (Mongoose CastError) instead of 400/404",
    strict=True,
)
def test_tc14b_read_product_with_malformed_id(api):
    """TC-14b (extra): GET with an id that is not an ObjectId should be a client error (400/404), not 500."""
    response = api.get("/product/getOne/not-an-id")
    assert response.status in (400, 404), f"got {response.status}: {response.text()}"


def test_tc15_update_post_status(api, buyer_token):
    """TC-15 (Update): PATCH changes a post's status and a follow-up GET shows the new value.

    The app has no endpoint to edit a product (no PUT/PATCH on /product), so the update
    check uses the closest real update: a buyer closing their own post.
    """
    title = unique_name("API Post")
    post_id = str(db.insert_post(cfg.BUYER_EMAIL, title))
    try:
        assert api.get(f"/post/get/{post_id}").json()["data"]["status"] == "open"

        response = api.patch(
            f"/buyer-dashboard/posts/{post_id}/status",
            headers=auth(buyer_token),
            data={"status": "closed"},
        )
        assert response.status == 200, response.text()
        assert response.json()["data"]["status"] == "closed"

        assert api.get(f"/post/get/{post_id}").json()["data"]["status"] == "closed"

        invalid = api.patch(
            f"/buyer-dashboard/posts/{post_id}/status",
            headers=auth(buyer_token),
            data={"status": "banana"},
        )
        assert invalid.status == 400
    finally:
        db.delete_test_posts()


def test_tc16_delete_product(api, seller_token):
    """TC-16 (Delete): Removing a product returns 200 and a follow-up GET returns 404."""
    created = create_product(api, seller_token, unique_name("API Delete Me"))
    assert created.status == 201, created.text()
    product_id = created.json()["data"]["_id"]

    response = api.post(f"/product/remove/{product_id}", headers=auth(seller_token))
    assert response.status == 200, response.text()

    assert api.get(f"/product/getOne/{product_id}").status == 404


@pytest.mark.xfail(
    reason="BUG-03: deleting a product id that does not exist returns 500 instead of 404",
    strict=True,
)
def test_tc16b_delete_missing_product(api, seller_token):
    """TC-16b (extra): Deleting an unknown product should return 404, not crash with 500."""
    response = api.post(f"/product/remove/{MISSING_ID}", headers=auth(seller_token))
    assert response.status == 404, f"got {response.status}: {response.text()}"
