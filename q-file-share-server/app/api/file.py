from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List

from app.auth.jwt_handler import get_access_token
from app.models.response_models import (
    ActivitiesResponse,
    ReceivedFilesResponse,
    SharedFilesResponse,
)
from app.quantum_protocols.kyber import Kyber
from app.services.file_services import (
    get_files_actitvity,
    retrieve_received_files,
    retrieve_shared_files,
)

router = APIRouter()

kyber = Kyber()
key_pair = kyber.generate_key_pair()


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
                "receivedFiles": received_files,
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
                "sharedFiles": shared_files,
            },
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error)
        )

import base64
@router.get("/test")
async def test() -> JSONResponse:
    try:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "t": key_pair["public_key"]["t"],
                "A": key_pair["public_key"]["A"],
                "s": key_pair["secret_key"]
            },
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )

from pydantic import BaseModel
class Payload(BaseModel):
    u: List[List[int]]
    v: List[int]


@router.post("/test1")
async def test(payload: Payload) -> JSONResponse:
    try:
        # print("S2", key_pair["secret_key"])
        uv = kyber.encapsulate(key_pair["public_key"]["t"], key_pair["public_key"]["seed"])
        print(kyber.decapsulate_message(key_pair["secret_key"], {"u": payload.u, "v": payload.v}))
        # kyber.decapsulate_message(key_pair["secret_key"], {"u": payload.u, "v": payload.v})
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Successful" 
            }
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )


import base64
@router.get("/test2")
async def test() -> JSONResponse:
    try:
        uv = kyber.encapsulate(key_pair["public_key"]["t"], key_pair["public_key"]["seed"])
        print(kyber.decapsulate_message(key_pair["secret_key"], {"u": uv["u"], "v": uv["v"]}))
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "message": "Successful"
            },
        )
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))
    except Exception as error:
        print(error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        )