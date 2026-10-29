from playwright.sync_api import Page, Locator


class ProductsPage:
    """The public /products listing with search box and filters."""

    def __init__(self, page: Page):
        self.page = page
        self.search_box = page.get_by_placeholder("Search products...")
        self.category_filter = page.get_by_test_id("category-filter")
        self.cards = page.get_by_test_id("product-card")
        self.empty_message = page.get_by_text("No products found matching your criteria")
        self.empty_list_message = page.get_by_text("No products available yet")

    def open(self):
        self.page.goto("/products")
        self.search_box.wait_for()
        return self

    def search(self, text: str):
        self.search_box.fill(text)

    def filter_by_category(self, category: str):
        self.category_filter.select_option(category)

    def card(self, title: str) -> Locator:
        """The product card whose heading is exactly `title`."""
        return self.cards.filter(has=self.page.get_by_role("heading", name=title, exact=True))
