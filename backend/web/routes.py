from fastapi import APIRouter
from backend.service.invoice_service import InvoiceService
from backend.repository.invoice_repo import InvoiceRepository
from backend.model.schemas import InvoiceCreate, InvoiceRead, SummaryDTO

router = APIRouter()
repo = InvoiceRepository()
service = InvoiceService(repo=repo)


@router.post("/invoices", response_model=InvoiceRead)
def create_invoice(invoice: InvoiceCreate):
    return service.create_invoice(invoice)


@router.get("/invoices", response_model=list[InvoiceRead])
def list_invoices():
    return service.list_invoices()


@router.get("/summary", response_model=SummaryDTO)
def summary():
    return service.calculate_summary()
