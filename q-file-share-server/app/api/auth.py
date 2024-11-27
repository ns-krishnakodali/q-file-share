from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from app.models.dto import LoginRequest, SignUpRequest
from app.services.auth_services import authenticate_user, regsiter_user

router = APIRouter()


@router.post("/login")
def login(request: LoginRequest) -> JSONResponse:
    try:
        access_token = authenticate_user(request)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Login Successful",
                "token": access_token,
            },
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.post("/sign-up")
def sign_up(request: SignUpRequest) -> JSONResponse:
    try:
        new_user = regsiter_user(request)
        print(request)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "User created successfully",
                "email": new_user.email,
            },
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )
