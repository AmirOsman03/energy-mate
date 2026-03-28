from backend.repository.invoice_repo import InvoiceRepository
from backend.model.schemas import SummaryDTO, InvoiceCreate
from backend.model.invoice import Invoice


class InvoiceService:
    def __init__(self, repo: InvoiceRepository):
        self.repo = repo

    def create_invoice(self, invoice_data: InvoiceCreate):
        # Generate simple ID based on current count
        invoices = self.repo.get_all_invoices()
        new_id = len(invoices) + 1
        
        invoice = Invoice(
            id=new_id,
            month=invoice_data.month,
            kwh=invoice_data.kwh,
            amount=invoice_data.amount
        )
        return self.repo.add_invoice(invoice)

    def list_invoices(self):
        return self.repo.get_all_invoices()

    def calculate_summary(self) -> SummaryDTO:
        invoices = self.repo.get_all_invoices()
        total_kwh = sum(i.kwh for i in invoices)
        total_amount = sum(i.amount for i in invoices)
        alerts = "High consumption!" if total_kwh > 500 else None
        return SummaryDTO(total_kwh=total_kwh, total_amount=total_amount, alerts=alerts)
