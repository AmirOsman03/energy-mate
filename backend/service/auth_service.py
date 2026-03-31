from sqlalchemy.orm import Session
from backend.infrastructure.oauth.google_oauth import exchange_code_for_token, get_user_info
from backend.model.user import User


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def handle_google_callback(self, code: str):
        token_data = exchange_code_for_token(code)

        access_token = token_data.get("access_token")
        if not access_token:
            raise Exception("Authentication failed")

        user_info = get_user_info(access_token)
        user = self.update_or_create_user(user_info)

        return {
            "user": user,
            "access_token": access_token
        }

    def update_or_create_user(self, user_info: dict):
        user_id = user_info.get("id") or user_info.get("sub")
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(id=user_id, email=email, name=name, picture=picture)
            self.db.add(user)
        else:
            user.email = email
            user.name = name
            user.picture = picture
        
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user_info(self, access_token: str):
        return get_user_info(access_token)
