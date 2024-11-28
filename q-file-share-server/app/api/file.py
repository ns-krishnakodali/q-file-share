from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from app.services.file_services import get_user_activity
from app.auth.jwt_handler import JWTBearer

router = APIRouter()

@router.get("/activity", dependencies=[Depends(JWTBearer())])
def get_activity(current_user: str = Depends(JWTBearer())) -> JSONResponse:
    try:
        activities = get_user_activity(current_user)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Activities fetched successfully",
                "activities": activities,
            },
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )


