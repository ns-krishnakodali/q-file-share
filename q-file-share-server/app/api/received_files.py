from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from ..db.db_session import get_db_session
from ..models.db_schemas import FileLog
from ..api.auth import get_current_user
from typing import Any

router = APIRouter()


class ReceivedFileResponse(BaseModel):
    name: str
    size: int
    received_on: datetime
    received_from: Any
    expiry: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.get("/received-files", response_model=List[ReceivedFileResponse])
async def get_received_files(
    current_user=Depends(get_current_user), db: Session = Depends(get_db_session)
):
    files = (
        db.query(
            FileLog.name,
            FileLog.size,
            FileLog.sent_on.label("received_on"),
            FileLog.from_email.label("received_from"),
            FileLog.expiry,
            FileLog.is_anonymous
        )
        .filter(
            FileLog.to_email == current_user.email,
            FileLog.status == "active",
            FileLog.expiry > datetime.now(),
        )
        .all()
    )

    files = [
        ReceivedFileResponse(
            name=file.name,
            size=file.size,
            received_on=file.received_on,
            received_from=file.received_from if not file.is_anonymous else None,
            expiry=file.expiry,
        )
        for file in files
    ]

    return files
