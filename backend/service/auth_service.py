from backend.infrastructure.oauth.google_oauth import exchange_code_for_token, get_user_info


class AuthService:
    def handle_google_callback(self, code: str):
        token_data = exchange_code_for_token(code)

        access_token = token_data.get("access_token")
        if not access_token:
            raise Exception("Authentication failed")

        user_info = get_user_info(access_token)

        return {
            "user": user_info,
            "access_token": access_token
        }

    def get_user_info(self, access_token: str):
        return get_user_info(access_token)
