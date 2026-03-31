from sqlalchemy.orm import Session
from backend.model.invoice import Invoice

class InvoiceRepository:
    def __init__(self, db: Session):
        self.db = db

    def add_invoice(self, invoice: Invoice):
        self.db.add(invoice)
        self.db.commit()
        self.db.refresh(invoice)
        return invoice

    def get_all_invoices(self, user_id: str):
        return self.db.query(Invoice).filter(Invoice.user_id == user_id).all()

    def get_invoice_by_id(self, invoice_id: int):
        return self.db.query(Invoice).filter(Invoice.id == invoice_id).first()
    
    def get_invoice_by_gmail_id(self, gmail_id: str):
        return self.db.query(Invoice).filter(Invoice.gmail_message_id == gmail_id).first()
