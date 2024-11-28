from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List

from app.auth.jwt_handler import get_access_token
from app.models.response_models import ReceivedFilesResponse, SharedFilesResponse
from app.services.file_services import retrieve_received_files, retrieve_shared_files

router = APIRouter()


@router.get("/received-files", response_model=List[ReceivedFilesResponse])
async def get_received_files(
    tokenPayload: str = Depends(get_access_token),
) -> JSONResponse:
    try:
        files: list = retrieve_received_files(tokenPayload.get("email"))
        return files
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error)
        )


@router.get("/shared-files", response_model=List[SharedFilesResponse])
async def get_received_files(
    tokenPayload: str = Depends(get_access_token),
) -> JSONResponse:
    try:
        files: list = retrieve_shared_files(tokenPayload.get("email"))
        print(files)
        return files
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error)
        )
