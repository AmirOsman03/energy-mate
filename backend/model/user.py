from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from backend.infrastructure.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)  # Google user ID (sub)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    picture = Column(String)

    invoices = relationship("Invoice", back_populates="user")
