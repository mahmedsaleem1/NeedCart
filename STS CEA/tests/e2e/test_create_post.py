# Owner: Ahmed
"""Feature 4: Buyer creates a requirement post (TC-10 to TC-12).

The post form requires an image, so TC-10 and TC-12 upload a tiny local PNG
(fixtures/test-image.png); the backend sends it to Cloudinary.
"""
import pytest
from playwright.sync_api import expect

from pages.create_post_page import CreatePostPage
from utils import db
from utils.test_data import unique_name

pytestmark = pytest.mark.e2e


@pytest.fixture(autouse=True)
def remove_test_posts():
    """Delete any STS-TEST post a test created, even if the test fails."""
    yield
    db.delete_test_posts()


@pytest.mark.positive
def test_tc10_buyer_creates_post(logged_in_buyer_page, snap):
    """TC-10: A logged-in buyer fills the form, sees the success message and the post appears in /posts."""
    page = logged_in_buyer_page
    title = unique_name("Phone request")
    form = CreatePostPage(page).open()
    form.fill(title, "Looking for a second-hand phone", "25000")
    form.submit()

    expect(page.get_by_text("Post created successfully")).to_be_visible(timeout=30_000)
    snap(page, "tc10_post_created")

    page.goto("/posts")
    page.get_by_placeholder("Search posts...").fill(title)
    expect(page.get_by_role("heading", name=title)).to_be_visible()
    assert db.count_posts_with_title(title) == 1


@pytest.mark.negative
def test_tc11_empty_title_is_rejected(logged_in_buyer_page):
    """TC-11: A post without a title is blocked by form validation and nothing is saved."""
    page = logged_in_buyer_page
    description = unique_name("no-title description")
    form = CreatePostPage(page).open()
    form.fill("", description, "5000")
    form.click_only()  # the browser blocks this submit, so no request is expected

    assert form.title.evaluate("el => el.validity.valueMissing") is True
    expect(page.get_by_text("Post created successfully")).to_have_count(0)
    assert db.get_db().posts.count_documents({"description": description}) == 0


@pytest.mark.negative
@pytest.mark.xfail(
    reason="BUG-02: the app accepts a negative budget (-100) and creates the post",
    strict=True,
)
def test_tc12_negative_budget_is_rejected(logged_in_buyer_page):
    """TC-12: A budget of -100 must be rejected.

    The correct behaviour is an error; the app currently accepts it (see BUG-02), so this is an xfail.
    """
    page = logged_in_buyer_page
    title = unique_name("Negative budget")
    form = CreatePostPage(page).open()
    form.fill(title, "Budget should be rejected", "-100")
    with page.expect_response(lambda r: "/post/create" in r.url, timeout=30_000) as response_info:
        form.submit()

    # Correct behaviour: the server rejects the post (4xx) and nothing is saved.
    assert response_info.value.status >= 400, "a post with a negative budget was accepted"
    assert db.count_posts_with_title(title) == 0
