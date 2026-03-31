from fastapi import APIRouter, Cookie, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.service.gmail_service import GmailService
from backend.service.auth_service import AuthService
from backend.service.invoice_service import InvoiceService
from backend.repository.invoice_repo import InvoiceRepository
from backend.infrastructure.database import get_db
from backend.model.schemas import InvoiceCreate

router = APIRouter(prefix="/evn", tags=["EVN"])

def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(db)

def get_invoice_service(db: Session = Depends(get_db)):
    repo = InvoiceRepository(db)
    return InvoiceService(repo=repo)

@router.get("/invoices")
def get_evn_invoices(
    access_token: str = Cookie(None), 
    auth_service: AuthService = Depends(get_auth_service),
    invoice_service: InvoiceService = Depends(get_invoice_service)
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated or session expired. Please log in again.")
    
    try:
        user_info = auth_service.get_user_info(access_token)
        # Ensure user exists in our DB (handles cases where DB was wiped but session is active)
        user = auth_service.update_or_create_user(user_info)
        user_id = user.id

        gmail_service = GmailService(access_token)
        fetched_invoices = gmail_service.get_evn_invoices()
        
        saved_invoices = []
        for inv in fetched_invoices:
            # Check if invoice already exists
            existing = invoice_service.get_by_gmail_id(inv["id"])
            if not existing:
                # Clean amount (remove " ден" and parse correctly)
                amount_str = inv["amount"].replace(" ден", "").strip()
                # Handle cases where thousands separator might be a dot and decimal a comma
                # but based on the example 4215.00 is standard
                try:
                    clean_amount = float(amount_str)
                except ValueError:
                    # Fallback for alternative formats if needed
                    clean_amount = float(amount_str.replace(",", ".")) if "," in amount_str else 0.0
                
                invoice_data = InvoiceCreate(
                    user_id=user_id,
                    amount=clean_amount,
                    gmail_message_id=inv["id"],
                    invoice_number=inv["invoice_number"],
                    customer_number=inv["customer_number"],
                    due_date=inv["due_date"],
                    subject=inv["subject"]
                )
                new_inv = invoice_service.create_invoice(invoice_data)
                saved_invoices.append(new_inv)
            else:
                saved_invoices.append(existing)

        return {"invoices": saved_invoices}
    except Exception as e:
        # Check if it might be an expired token error
        if "invalid_grant" in str(e) or "401" in str(e):
            raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
        raise HTTPException(status_code=500, detail=f"Failed to fetch invoices: {str(e)}")
