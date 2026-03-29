from fastapi import APIRouter, Response, Query, Cookie
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode

from backend.config.config import GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, FRONTEND_URL
from backend.service.auth_service import AuthService

router = APIRouter()
auth_service = AuthService()


@router.get("/login")
def login():
    params = urlencode({
        "client_id": GOOGLE_CLIENT_ID,
        "response_type": "code",
        "scope": "openid email profile",
        "redirect_uri": GOOGLE_REDIRECT_URI,
    })

    return RedirectResponse(
        f"https://accounts.google.com/o/oauth2/v2/auth?{params}"
    )


@router.get("/callback")
def callback(code: str = Query(...)):
    data = auth_service.handle_google_callback(code)

    response = RedirectResponse(url=FRONTEND_URL)
    response.set_cookie(
        key="access_token",
        value=data["access_token"],
        httponly=True,
        samesite="lax"
    )

    return response


@router.get("/me")
def me(access_token: str = Cookie(None)):
    if not access_token:
        return {"user": None}

    try:
        user_info = auth_service.get_user_info(access_token)
        return {"user": user_info}
    except Exception:
        return {"user": None}


@router.get("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out"}
