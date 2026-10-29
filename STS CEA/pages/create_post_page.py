from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import Page

from utils.config import TEST_IMAGE


class CreatePostPage:
    """The /create-post form (buyers only)."""

    def __init__(self, page: Page):
        self.page = page
        self.title = page.get_by_placeholder("Title")
        self.description = page.get_by_placeholder("Description")
        self.budget = page.get_by_placeholder("Budget")
        self.image = page.locator("input[type='file']")
        self.submit_button = page.get_by_role("button", name="Create Post")
        self.heading = page.get_by_role("heading", name="Create a New Post")

    def open(self):
        self.page.goto("/create-post")
        self.heading.wait_for()
        return self

    def fill(self, title: str, description: str, budget: str, with_image: bool = True):
        self.title.fill(title)
        self.description.fill(description)
        self.budget.fill(budget)
        if with_image:
            self.image.set_input_files(str(TEST_IMAGE))

    def submit(self):
        """Click 'Create Post' until the app really sends the request.

        Right after a page load Firebase is still restoring the saved login, and the app
        silently does nothing if you submit before that finished. Clicking again is what a
        user would do; it is not a hard wait.
        """
        for _ in range(6):
            try:
                with self.page.expect_request(lambda r: "/post/create" in r.url, timeout=5000):
                    self.submit_button.click()
                return
            except PlaywrightError:  # timeout: the click was swallowed, try again
                continue
        raise AssertionError("the app never sent the create-post request")
