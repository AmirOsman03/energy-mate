from datetime import date, timedelta
import calendar
from backend.repository.invoice_repo import InvoiceRepository
from backend.model.schemas import SummaryDTO, InvoiceCreate, AnalyticsDTO, MonthlyTrend, SeasonalBreakdown
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
    
    def calculate_analytics(self, user_id: str) -> AnalyticsDTO:
        invoices = self.repo.get_all_invoices(user_id)
        if not invoices:
            return AnalyticsDTO(
                monthly_trend=[],
                seasonal_breakdown=[],
                total_spent=0,
                avg_monthly=0,
                peak_usage_kwh=0,
                peak_month="N/A"
            )

        # Monthly Trend
        monthly_data = {}
        for i in range(1, 13):
            monthly_data[i] = 0.0
        
        for inv in invoices:
            month_idx = inv.created_at.month
            if inv.due_date and "." in inv.due_date:
                try:
                    month_idx = int(inv.due_date.split(".")[1])
                except:
                    pass
            monthly_data[month_idx] += inv.amount

        monthly_trend = [
            MonthlyTrend(month=calendar.month_name[m][:3], cost=round(c, 2))
            for m, c in sorted(monthly_data.items())
        ]

        # Seasonal Breakdown
        seasons = {
            "Winter": [12, 1, 2],
            "Spring": [3, 4, 5],
            "Summer": [6, 7, 8],
            "Autumn": [9, 10, 11]
        }
        seasonal_breakdown = []
        for name, months in seasons.items():
            cost = sum(monthly_data[m] for m in months)
            seasonal_breakdown.append(SeasonalBreakdown(name=name, cost=round(cost, 2)))

        total_spent = sum(i.amount for i in invoices)
        avg_monthly = total_spent / len(set(inv.created_at.month for inv in invoices)) if invoices else 0
        
        peak_inv = max(invoices, key=lambda x: x.kwh or 0)
        peak_usage_kwh = peak_inv.kwh or 0
        peak_month = calendar.month_name[peak_inv.created_at.month]

        return AnalyticsDTO(
            monthly_trend=monthly_trend,
            seasonal_breakdown=seasonal_breakdown,
            total_spent=round(total_spent, 2),
            avg_monthly=round(avg_monthly, 2),
            peak_usage_kwh=peak_usage_kwh,
            peak_month=peak_month
        )

    def get_by_gmail_id(self, gmail_id: str):
        return self.repo.get_invoice_by_gmail_id(gmail_id)
