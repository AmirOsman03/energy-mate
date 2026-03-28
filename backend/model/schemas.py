from typing import Optional

from pydantic import BaseModel, PositiveFloat


class InvoiceCreate(BaseModel):
    month: str
    kwh: PositiveFloat
    amount: PositiveFloat


class InvoiceRead(BaseModel):
    id: int
    month: str
    kwh: float
    amount: float


class SummaryDTO(BaseModel):
    total_kwh: float
    total_amount: float
    alerts: Optional[str] = None
