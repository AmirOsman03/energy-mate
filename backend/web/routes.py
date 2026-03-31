from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.service.invoice_service import InvoiceService
from backend.repository.invoice_repo import InvoiceRepository
from backend.model.schemas import InvoiceCreate, InvoiceRead, SummaryDTO
from backend.infrastructure.database import get_db

router = APIRouter()

def get_invoice_service(db: Session = Depends(get_db)):
    repo = InvoiceRepository(db)
    return InvoiceService(repo=repo)

@router.post("/invoices", response_model=InvoiceRead)
def create_invoice(invoice: InvoiceCreate, service: InvoiceService = Depends(get_invoice_service)):
    return service.create_invoice(invoice)


@router.get("/invoices", response_model=list[InvoiceRead])
def list_invoices(user_id: str, service: InvoiceService = Depends(get_invoice_service)):
    return service.list_invoices(user_id)


@router.get("/summary", response_model=SummaryDTO)
def summary(user_id: str, service: InvoiceService = Depends(get_invoice_service)):
    return service.calculate_summary(user_id)
