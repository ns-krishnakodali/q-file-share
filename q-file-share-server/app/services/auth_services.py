import datetime

from app.auth.password_handler import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.models.user import User
from app.models.dto.auth_dto import LoginRequest, SignUpRequest
from app.db.db_session import get_db_session


def authenticate_user(request: LoginRequest) -> str:
    db = next(get_db_session())

    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise ValueError("Email not registered. Please check the email address.")
        
    if not verify_password(request.password, user.password_hash):
        raise ValueError("Invalid password. Please try again.")

    return create_access_token({"email": user.email})


def regsiter_user(request: SignUpRequest) -> User:
    db = next(get_db_session())
    existing_user = db.query(User).filter(User.email == request.email).first()

    if existing_user:
        raise ValueError("A user with this email already exists.")

    hashed_password = hash_password(request.password)
    new_user = User(
        name=request.name,
        email=request.email,
        password_hash=hashed_password,
        created_at=datetime.datetime.now(datetime.UTC),
        updated_at=datetime.datetime.now(datetime.UTC),
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    except Exception as exception:
        raise ValueError("Error when processing the request", str(exception))
