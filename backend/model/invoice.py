from dataclasses import dataclass
from datetime import date


@dataclass
class Invoice:
    id: int
    month: str
    kwh: float
    amount: float
    created_at: date = date.today()
