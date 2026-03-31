from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.web.routes import router
from backend.web.auth_routes import router as auth_router
from backend.web.evn_routes import router as evn_router
from backend.infrastructure.database import engine, Base
from backend.model.user import User
from backend.model.invoice import Invoice

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Energy Mate")

# Enable CORS for React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router, prefix="/auth")
app.include_router(evn_router)
