from fastapi import APIRouter, Depends, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from pydantic import BaseModel, ConfigDict
from ..db.db_session import get_db_session
from ..models.db_schemas import FileLog
from ..api.auth import get_current_user
import uuid
from pydantic import Field

router = APIRouter()

class SharedFileResponse(BaseModel):
    name: str
    size: int
    sent_to: str = Field(alias="to_email")
    sent_on: datetime
    expiry: datetime
    download_count: int
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

@router.get("/shared-files", response_model=List[SharedFileResponse])
async def get_shared_files(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    files = db.query(FileLog).filter(
        FileLog.from_email == current_user.email,
        FileLog.status == "active",
        FileLog.expiry > datetime.now()
    ).all()
    return files

@router.post("/send-file")
async def share_file(
    file: UploadFile,
    recipient_email: str = Form(...),
    expiry_days: int = Form(default=7),
    download_count: int = Form(default=10),
    is_anonymous: bool = Form(default=False),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    file_id = str(uuid.uuid4())
    file_content = await file.read()
    
    file_log = FileLog(
        name=file.filename,
        size=len(file_content),
        from_email=current_user.email if not is_anonymous else None,
        to_email=recipient_email,
        sent_on=datetime.now(),
        expiry=datetime.now() + timedelta(days=expiry_days),
        download_count=download_count,
        file_id=file_id,
        is_anonymous=is_anonymous,
        status="active"
    )
    
    db.add(file_log)
    db.commit()
    db.refresh(file_log)
    
    return {"message": "File shared successfully", "file_id": file_id}
