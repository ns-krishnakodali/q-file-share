import datetime

from app.db.db_session import get_db_session
from app.models.db_models import FileLog
from app.models.response_models import ReceivedFilesResponse, SharedFilesResponse


def retrieve_received_files(email: str) -> str:
    db = next(get_db_session())
    files = (
        db.query(
            FileLog.name,
            FileLog.size,
            FileLog.sent_on.label("received_on"),
            FileLog.from_email.label("received_from"),
            FileLog.expiry,
            FileLog.is_anonymous,
        )
        .filter(
            FileLog.to_email == email,
            FileLog.status == "active",
            FileLog.expiry > datetime.datetime.now(),
        )
        .all()
    )

    return [
        ReceivedFilesResponse(
            name=file.name,
            size=file.size,
            received_on=file.received_on,
            received_from=file.received_from if not file.is_anonymous else None,
            expiry=file.expiry,
        )
        for file in files
    ]


def retrieve_shared_files(email: str) -> str:
    db = next(get_db_session())
    files = (
        db.query(
            FileLog.name,
            FileLog.size,
            FileLog.sent_on.label("received_on"),
            FileLog.to_email.label("received_from"),
            FileLog.expiry,
            FileLog.is_anonymous,
        )
        .filter(
            FileLog.from_email == email,
            FileLog.status == "active",
            FileLog.expiry > datetime.datetime.now(),
        )
        .all()
    )

    return [
        SharedFilesResponse(
            name=file.name,
            size=file.size,
            sent_on=file.received_on,
            sent_to=file.received_from if not file.is_anonymous else None,
            expiry=file.expiry,
        )
        for file in files
    ]
