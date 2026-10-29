# NeedCart – Playwright (Python) test suite

End-to-end, API and network-mocking tests for the NeedCart marketplace, written with Playwright + pytest.

## Team
- **Shaheer** – Login, Signup + OTP, API CRUD tests, test-user setup script, intentional bug demo
- **Ahmed** – Product search/filter, Create post, network mocking, cross-browser runs
- **Both** – shared fixtures/utilities, README, REPORT.md

## App notes (what the code really does)
- Frontend `http://localhost:5173` (React/Vite), backend `http://localhost:8000` (Express + MongoDB Atlas db `NeedKart`), auth = Firebase email/password. The ID token is sent as `Authorization: Bearer <idToken>`; the role (buyer/seller) comes from which MongoDB collection holds the user.
- Frontend routes: `/login`, `/signup` (OTP shown as a modal), `/products`, `/posts`, `/create-post`, `/buyer`, `/seller`. After login the app redirects to `/` (not the dashboard). After a correct OTP it shows a message and goes to `/login` (the user is not auto-logged-in).
- Backend routes have **no `/api` prefix and no versioning**: `/auth/signup`, `/auth/verify-otp`, `/product/add|all|getOne/:id|remove/:id`, `/post/create|all|get/:id`, `/buyer-dashboard/posts/:id/status`.
- **There is no product update endpoint** (no PUT/PATCH on `/product`) and delete is `POST /product/remove/:id`. TC-15 (Update) therefore tests the closest real update: `PATCH /buyer-dashboard/posts/:id/status`.
- Product and post creation **require an image** (Multer → Cloudinary). Tests use `fixtures/test-image.png` (74 bytes). Cloudinary is hit by TC-13, TC-16, TC-10, TC-12.
- Product search/filter is done in the browser on the list returned by `GET /product/all` (envelope `{statusCode, data, message, success}`).
- OTPs are stored in MongoDB collection `otps` and read from there by the tests.
- **SMTP on this machine is broken**: Gmail rejects the backend's app password, so `POST /auth/signup` returns 500 *after* saving the OTP. The signup page object and the setup script treat exactly that "Failed to send OTP email" answer as success. If your SMTP works, nothing is bypassed.
- Seeded products for TC-07..09 are inserted straight into MongoDB (not through the API) to avoid 3 Cloudinary uploads per run. The seller is marked `is_verified` in MongoDB by the setup script (normally an admin does that).
- The database is shared with real data. Tests only create/delete records whose title starts with `STS-TEST`.
- `data-testid` added to the app (2 only): `product-card` in `Frontend/src/components/Product/ProductCard.jsx`, `category-filter` in `Frontend/src/pages/Products.jsx`.

## Setup
```
cd "STS CEA"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium firefox webkit
copy .env.test.example .env.test      # then fill in the values (extra key: SIGNUP_TEST_PASSWORD)
python scripts/setup_test_users.py    # one time: creates the test buyer + seller
```

## How to run
Start the backend (`npm start` in `Backend/`) and frontend (`npm run dev` in `Frontend/`), then from `STS CEA`. Tests run **headed** (visible browser, `--slowmo 150`) by default.
```
pytest                                                    # one browser (default chromium)
pytest --browser chromium --browser firefox --browser webkit    # all browsers, one report
pytest --browser chromium --device "Pixel 7" -m "e2e or mock"   # mobile emulation
pytest tests/e2e/test_login.py        # one file
pytest -m negative                    # one marker (e2e, api, mock, positive, negative)
```
Failed tests are retried up to 2 times (`pytest-rerunfailures`) because Firebase/Atlas/Cloudinary calls occasionally drop.

## Folder structure
`tests/{e2e,api,mock}` tests · `pages/` page objects · `utils/` config, Firebase REST, MongoDB helpers · `scripts/` user setup + Firebase user delete · `fixtures/` test image · `reports/` HTML reports · `screenshots/<browser>/` evidence · `bug-demo/` intentional bug.

## Reports and screenshots
One report: [REPORT.md](REPORT.md) (everything: approach, test table, results, bugs, bug demo, screenshots). `reports/report.html` is the raw pytest-html output of the latest run. Screenshots: `screenshots/<browser>/` and `screenshots/bug-demo/`.

## Bug demo
A one-line bug (search ignores the typed text) is caught by TC-07 and TC-09 - see [bug-demo/README.md](bug-demo/README.md) and `bug-demo/bug.patch`.

## Before zipping
Delete `.env.test`, `.venv/` and `test-results/` (secrets / large).
