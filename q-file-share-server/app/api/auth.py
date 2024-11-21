from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.models.user import User
from app.db.db_session import SessionLocal
from app.utils.password_handler import verify_password
from app.auth.jwt_handler import create_access_token

class LoginRequest(BaseModel):
    username: str
    password: str

router = APIRouter()

@router.post("/login")
def login(request: LoginRequest):
    # user = get_user_from_db(request.username)
    # if not user:
    #     raise HTTPException(status_code=400, detail="Invalid credentials")

    # if not verify_password(request.password, user.password):
    #     raise HTTPException(status_code=400, detail="Invalid credentials")

    # token = create_access_token(data={"sub": request.username})
    print(request.username)
    return {"access_token": "token", "token_type": "bearer"}
