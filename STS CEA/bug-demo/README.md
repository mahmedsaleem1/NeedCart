# Intentional bug demo

**Bug added** (temporary git branch `bug-demo`, never merged): in `Frontend/src/pages/Products.jsx` the search predicate was replaced by
`const matchesSearch = true;`, so the search box ignores what the user types. The exact diff is in [bug.patch](bug.patch).

**Run:** `tests/e2e/test_product_search.py`, Chromium, headed -> 2 failed, 1 passed.
- TC-07 (search finds matching product) FAILED: `Locator expected to have count '0' ... unexpected value "1"` - the STS-TEST Novel card was still shown.
  Screenshot: `../screenshots/bug-demo/bug_tc07_failed.png`
- TC-09 (nonsense search shows empty state) FAILED: `Locator expected to be visible` - products were shown instead of "No products found".
  Screenshot: `../screenshots/bug-demo/bug_tc09_failed.png`
- TC-08 (category filter) still passed, as it should.

**Revert:** change checked out, branch deleted, back on `main`; the search tests passed again (3 passed). Full results: [../REPORT.md](../REPORT.md).
