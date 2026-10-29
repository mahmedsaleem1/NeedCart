# Owner: Ahmed
"""Network mocking tests (TC-17 and TC-18).

The /products page loads its data with `fetch(VITE_URL + "/product/all")`.
We intercept that request with page.route() and fake the backend's answer.
"""
import json

import pytest
from playwright.sync_api import Page, expect

from pages.products_page import ProductsPage

pytestmark = [pytest.mark.mock, pytest.mark.usefixtures("fail_on_js_errors")]

PRODUCTS_URL = "**/product/all"
# The page (localhost:5173) calls the API (localhost:8000), so faked answers need CORS headers.
CORS = {"access-control-allow-origin": "*"}


def fake_products_response(page: Page, status: int, body: dict):
    page.route(
        PRODUCTS_URL,
        lambda route: route.fulfill(
            status=status,
            content_type="application/json",
            headers=CORS,
            body=json.dumps(body),
        ),
    )


def test_tc17_empty_product_list(page: Page, snap):
    """TC-17: When the API returns an empty list the page shows an empty-state message.

    There must be no product cards and no uncaught JavaScript errors.
    """
    fake_products_response(
        page,
        200,
        {"statusCode": 200, "data": [], "message": "Products fetched successfully", "success": True},
    )
    products = ProductsPage(page).open()

    expect(products.empty_list_message).to_be_visible()
    expect(products.cards).to_have_count(0)
    snap(page, "tc17_mock_empty_list")


@pytest.mark.negative
def test_tc18_server_error_is_handled(page: Page, snap):
    """TC-18: When the API answers 500 the page shows the error message instead of going blank.

    The header must still render, the 'Try Again' button must be offered, and there must be
    no uncaught JavaScript errors.
    """
    fake_products_response(page, 500, {"message": "Internal Server Error"})
    products = ProductsPage(page).open()

    expect(page.get_by_text("Internal Server Error")).to_be_visible()
    expect(page.get_by_role("button", name="Try Again")).to_be_visible()
    expect(products.cards).to_have_count(0)
    expect(page.get_by_role("link", name="NEEDCART")).to_be_visible()  # header still rendered
    snap(page, "tc18_mock_server_error")
