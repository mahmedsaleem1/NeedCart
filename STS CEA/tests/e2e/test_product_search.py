# Owner: Ahmed
"""Feature 3: Browse, search and filter products (TC-07 to TC-09).

Three known products are seeded by the `seeded_products` fixture.
"""
import pytest
from playwright.sync_api import Page, expect

from pages.products_page import ProductsPage
from utils.test_data import NO_RESULTS_QUERY

pytestmark = [pytest.mark.e2e, pytest.mark.usefixtures("seeded_products")]


@pytest.mark.positive
def test_tc07_search_finds_matching_product(page: Page, snap):
    """TC-07: Searching 'STS-TEST Laptop' shows the laptop and hides the other seeded items."""
    products = ProductsPage(page).open()
    products.search("STS-TEST Laptop")

    expect(products.card("STS-TEST Laptop")).to_be_visible()
    expect(products.card("STS-TEST Novel")).to_have_count(0)
    expect(products.card("STS-TEST Tshirt")).to_have_count(0)
    snap(page, "tc07_search_results")


@pytest.mark.positive
def test_tc08_filter_by_category_books(page: Page, snap):
    """TC-08: Filtering by 'Books' leaves only Books products, including our seeded novel."""
    products = ProductsPage(page).open()
    products.filter_by_category("Books")

    expect(products.card("STS-TEST Novel")).to_be_visible()
    expect(products.card("STS-TEST Laptop")).to_have_count(0)
    # every visible card carries the 'Books' category badge
    for card in products.cards.all():
        expect(card.get_by_text("Books", exact=True)).to_be_visible()
    snap(page, "tc08_category_filter")


@pytest.mark.negative
def test_tc09_nonsense_search_shows_empty_state(page: Page):
    """TC-09: A nonsense search shows the 'no products found' message and the page keeps working."""
    products = ProductsPage(page).open()
    products.search(NO_RESULTS_QUERY)

    expect(products.empty_message).to_be_visible()
    expect(products.cards).to_have_count(0)
    expect(page.get_by_role("heading", name="Browse Products")).to_be_visible()
