from datetime import date, timedelta
from backend.repository.invoice_repo import InvoiceRepository
from backend.model.schemas import SummaryDTO, InvoiceCreate
from backend.model.invoice import Invoice


class InvoiceService:
    def __init__(self, repo: InvoiceRepository):
        self.repo = repo

    def create_invoice(self, invoice_data: InvoiceCreate):
        invoice = Invoice(
            user_id=invoice_data.user_id,
            month=invoice_data.month,
            kwh=invoice_data.kwh,
            amount=invoice_data.amount,
            gmail_message_id=invoice_data.gmail_message_id,
            invoice_number=invoice_data.invoice_number,
            customer_number=invoice_data.customer_number,
            due_date=invoice_data.due_date,
            subject=invoice_data.subject
        )
        return self.repo.add_invoice(invoice)

    def list_invoices(self, user_id: str):
        return self.repo.get_all_invoices(user_id)

    def calculate_summary(self, user_id: str) -> SummaryDTO:
        invoices = self.repo.get_all_invoices(user_id)
        if not invoices:
            return SummaryDTO(total_kwh=0, total_amount=0)

        total_kwh = sum(i.kwh for i in invoices if i.kwh is not None)
        total_amount = sum(i.amount for i in invoices)
        
        # Sort invoices by created_at to find the most recent one
        sorted_invoices = sorted(invoices, key=lambda x: x.created_at, reverse=True)
        latest_invoice = sorted_invoices[0]
        
        prev_month_kwh = latest_invoice.kwh or 0.0
        prev_month_amount = latest_invoice.amount
        
        # Average daily usage based on latest month's kWh
        avg_daily_usage = prev_month_kwh / 30.0 if prev_month_kwh else 0.0
        
        alerts = "High consumption!" if total_kwh > 500 else None
        
        return SummaryDTO(
            total_kwh=total_kwh,
            total_amount=total_amount,
            prev_month_kwh=prev_month_kwh,
            prev_month_amount=prev_month_amount,
            avg_daily_usage=round(avg_daily_usage, 2),
            alerts=alerts
        )
    
    def get_by_gmail_id(self, gmail_id: str):
        return self.repo.get_invoice_by_gmail_id(gmail_id)
