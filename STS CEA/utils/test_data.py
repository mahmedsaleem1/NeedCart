"""Unique-name generators and constants shared by the tests."""
import time

PREFIX = "STS-TEST"

# Known products seeded for the search/filter tests: (title, category, price)
SEEDED_PRODUCTS = [
    (f"{PREFIX} Laptop", "Electronics", 150000),
    (f"{PREFIX} Novel", "Books", 1200),
    (f"{PREFIX} Tshirt", "Clothing", 1500),
]

NO_RESULTS_QUERY = "zzqxv-no-such-item-123"


def unique_name(label: str = "") -> str:
    """Return e.g. 'STS-TEST-1730000000000 label' so every record is recognisable."""
    stamp = f"{PREFIX}-{int(time.time() * 1000)}"
    return f"{stamp} {label}".strip()
