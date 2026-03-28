from backend.model.invoice import Invoice
from backend.data.seed_data import INITIAL_INVOICES


class InvoiceRepository:
    def __init__(self):
        # Use initial seed data from the data folder
        self._db = list(INITIAL_INVOICES)

    def add_invoice(self, invoice: Invoice):
        self._db.append(invoice)
        return invoice

    def get_all_invoices(self):
        return self._db

    def get_invoice_by_id(self, invoice_id: int):
        return next((i for i in self._db if i.id == invoice_id), None)
