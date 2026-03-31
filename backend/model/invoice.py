from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from backend.infrastructure.database import Base
from backend.model.user import User
from datetime import date

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    
    # Common fields
    month = Column(String, nullable=True)
    kwh = Column(Float, nullable=True)
    amount = Column(Float)
    created_at = Column(Date, default=date.today)
    
    # Gmail specific fields
    gmail_message_id = Column(String, unique=True, nullable=True)
    invoice_number = Column(String, nullable=True)
    customer_number = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    subject = Column(String, nullable=True)

    user = relationship("User", back_populates="invoices")
