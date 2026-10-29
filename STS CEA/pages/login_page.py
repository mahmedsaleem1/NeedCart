from playwright.sync_api import Page


class LoginPage:
    """The /login screen."""

    def __init__(self, page: Page):
        self.page = page
        self.email = page.get_by_placeholder("Enter your email")
        self.password = page.get_by_placeholder("Enter your password")
        self.submit_button = page.get_by_role("button", name="Sign in")

    def open(self):
        self.page.goto("/login")
        return self

    def login(self, email: str, password: str):
        self.email.fill(email)
        self.password.fill(password)
        self.submit_button.click()
