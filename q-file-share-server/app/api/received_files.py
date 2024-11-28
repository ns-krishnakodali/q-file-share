from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from ..db.db_session import get_db_session
from ..models.db_schemas import FileLog
from ..api.auth import get_current_user

router = APIRouter()

class ReceivedFileResponse(BaseModel):
    name: str
    size: int
    sent_on: datetime
    expiry: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


@router.get("/received-files", response_model=List[ReceivedFileResponse])
async def get_received_files(
    current_user=Depends(get_current_user), db: Session = Depends(get_db_session)
):
    files = (
        db.query(FileLog)
        .filter(
            FileLog.to_email == current_user.email,
            FileLog.status == "active",
            FileLog.expiry > datetime.now(),
        )
        .all()
    )
    return files
