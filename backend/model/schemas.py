from typing import Optional, List
from pydantic import BaseModel, PositiveFloat
from datetime import date

class UserBase(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None

class UserRead(UserBase):
    class Config:
        from_attributes = True

class InvoiceCreate(BaseModel):
    month: Optional[str] = None
    kwh: Optional[float] = None
    amount: float
    user_id: str
    gmail_message_id: Optional[str] = None
    invoice_number: Optional[str] = None
    customer_number: Optional[str] = None
    due_date: Optional[str] = None
    subject: Optional[str] = None

class InvoiceRead(BaseModel):
    id: int
    user_id: str
    month: Optional[str] = None
    kwh: Optional[float] = None
    amount: float
    created_at: date
    gmail_message_id: Optional[str] = None
    invoice_number: Optional[str] = None
    customer_number: Optional[str] = None
    due_date: Optional[str] = None
    subject: Optional[str] = None

    class Config:
        from_attributes = True

class SummaryDTO(BaseModel):
    total_kwh: float
    total_amount: float
    alerts: Optional[str] = None
