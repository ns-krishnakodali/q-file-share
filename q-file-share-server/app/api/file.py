from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List

from app.auth.jwt_handler import get_access_token
from app.models.response_models import (
    ActivitiesResponse,
    ReceivedFilesResponse,
    SharedFilesResponse,
)
from app.services.file_services import (
    get_files_actitvity,
    retrieve_received_files,
    retrieve_shared_files,
)

router = APIRouter()


@router.get("/activity", response_model=List[ActivitiesResponse])
async def get_activity(
    tokenPayload: str = Depends(get_access_token),
) -> JSONResponse:
    try:
        file_activities = get_files_actitvity(tokenPayload.get("email"))
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "activities": file_activities,
            },
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )


@router.get("/received-files", response_model=List[ReceivedFilesResponse])
async def get_received_files(
    tokenPayload: str = Depends(get_access_token),
) -> JSONResponse:
    try:
        received_files: list = retrieve_received_files(tokenPayload.get("email"))
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "activities": received_files,
            },
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error)
        )


@router.get("/shared-files", response_model=List[SharedFilesResponse])
async def get_received_files(
    tokenPayload: str = Depends(get_access_token),
) -> JSONResponse:
    try:
        shared_files: list = retrieve_shared_files(tokenPayload.get("email"))
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "activities": shared_files,
            },
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error)
        )
