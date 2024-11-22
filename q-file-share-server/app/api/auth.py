import datetime

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models.user import User
from app.db.db_session import get_db_session
from app.utils.password_handler import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.models.dto.auth import LoginRequest, SignUpRequest


router = APIRouter()


@router.post("/login")
def login(request: LoginRequest):
    # user = get_user_from_db(request.username)
    # if not user:
    #     raise HTTPException(status_code=400, detail="Invalid credentials")

    # if not verify_password(request.password, user.password):
    #     raise HTTPException(status_code=400, detail="Invalid credentials")

    # token = create_access_token(data={"sub": request.username})
    print(request.email)
    return {"access_token": "token", "token_type": "bearer"}


@router.post("/sign-up")
def sign_up(request: SignUpRequest, db: Session = Depends(get_db_session)):
    existing_user = db.query(User).filter(User.email == request.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400, detail="A user with this email already exists."
        )

    hashed_password = hash_password(request.password)

    new_user = User(
        username=request.username,
        email=request.email,
        password_hash=hashed_password,
        created_at=datetime.datetime.now(datetime.UTC),
        updated_at=datetime.datetime.now(datetime.UTC),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "message": "User created successfully",
            "email": new_user.email,
        },
    )
