from fastapi import APIRouter, Cookie, HTTPException
from backend.service.gmail_service import GmailService

router = APIRouter(prefix="/evn", tags=["EVN"])

@router.get("/invoices")
def get_evn_invoices(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated or session expired. Please log in again.")
    
    try:
        gmail_service = GmailService(access_token)
        invoices = gmail_service.get_evn_invoices()
        return {"invoices": invoices}
    except Exception as e:
        # Check if it might be an expired token error
        if "invalid_grant" in str(e) or "401" in str(e):
            raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
        raise HTTPException(status_code=500, detail=f"Failed to fetch invoices: {str(e)}")
