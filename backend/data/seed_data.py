from backend.model.invoice import Invoice
from datetime import date

INITIAL_INVOICES = [
    Invoice(id=1, month="October", kwh=420.0, amount=150.0, created_at=date(2025, 10, 15)),
    Invoice(id=2, month="November", kwh=480.0, amount=175.0, created_at=date(2025, 11, 15)),
    Invoice(id=3, month="December", kwh=550.0, amount=210.0, created_at=date(2025, 12, 15)),
    Invoice(id=4, month="January", kwh=510.0, amount=195.0, created_at=date(2026, 1, 15)),
    Invoice(id=5, month="February", kwh=460.0, amount=165.0, created_at=date(2026, 2, 15)),
]
