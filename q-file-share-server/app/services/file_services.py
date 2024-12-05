import base64
import datetime

from app.db.db_session import get_db_session
from app.models.db_models import FileLog
from app.quantum_protocols.kyber import Kyber
from app.models.response_models import (
    ActivitiesResponse,
    ReceivedFilesResponse,
    SharedFilesResponse,
)


def get_kyber_key_details():
    kyber = Kyber()
    key_pair = kyber.generate_key_pair()
    seed = base64.b64encode(key_pair["public_key"]["seed"]).decode('utf-8', errors="ignore")

    return {"t": key_pair["public_key"]["t"], "seed": seed, "s": key_pair["secret_key"]}


def get_files_actitvity(user_email: str):
    db = next(get_db_session())
    files = (
        db.query(FileLog)
        .filter((FileLog.from_email == user_email) | (FileLog.to_email == user_email))
        .order_by(FileLog.sent_on.desc())
        .limit(10)
        .all()
    )
    return [
        ActivitiesResponse(
            name=file.name, received_from=file.from_email, sent_to=file.to_email
        )
        for file in files
    ]


def retrieve_received_files(user_email: str) -> str:
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
            FileLog.to_email == user_email,
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
            received_from=file.from_email if not file.is_anonymous else None,
            expiry=file.expiry,
        )
        for file in files
    ]


def retrieve_shared_files(user_email: str) -> str:
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
            FileLog.from_email == user_email,
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
            sent_to=file.to_email if not file.is_anonymous else None,
            expiry=file.expiry,
        )
        for file in files
    ]
