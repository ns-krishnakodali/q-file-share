import base64
import datetime
import json

from fastapi import HTTPException
from datetime import datetime, timezone, timedelta

from app.db.db_session import get_db_session
from app.models.db_models import Files, FileLogs, Users
from app.models.dto import FileUploadDTO
from app.models.response_models import (
    ActivitiesResponse,
    ReceivedFilesResponse,
    SharedFilesResponse,
)
from app.quantum_protocols.kyber import Kyber
from app.utils.file_handler import (
    encrypt_file_data,
    decrypt_file_data,
    decrypt_client_file_data,
    generate_file_hash,
    verify_file_signature,
)


def get_kyber_key_details():
    kyber = Kyber()
    key_pair = kyber.generate_key_pair()
    seed = base64.b64encode(key_pair["public_key"]["seed"]).decode(
        "utf-8", errors="ignore"
    )

    return {"t": key_pair["public_key"]["t"], "seed": seed, "s": key_pair["secret_key"]}


async def upload_files(
    encrypted_file_buffers: list,
    file_upload_dto: FileUploadDTO,
    secret_key: list,
    user_email: str,
):
    db = next(get_db_session())
    try:
        if file_upload_dto.recipient_email.strip() == user_email:
            raise ValueError("Cannot send to same email")

        user_password = (
            db.query(Users).filter(Users.email == user_email).first().password_hash
        )

        kyber = Kyber()
        uv_kyber_key = json.loads(file_upload_dto.kyber_key)
        shared_key = kyber.cpa_decrypt(secret_key, uv_kyber_key)

        dl_file_signatures = [
            json.loads(signature) for signature in (file_upload_dto.file_signatures)
        ]

        dl_public_key = json.loads(file_upload_dto.dl_public_key)
        file_logs = list()

        for index in range(len(encrypted_file_buffers)):
            file_data = await decrypt_client_file_data(
                encrypted_file_buffers[index],
                file_upload_dto.init_vectors[index],
                shared_key,
            )

            is_valid_file = verify_file_signature(
                file_data, dl_file_signatures[index], dl_public_key
            )
            if not is_valid_file:
                raise ValueError("Corrupted file, please check and re-upload")

            file_hash = generate_file_hash(file_data)
            encrypted_file_data = await encrypt_file_data(file_data, user_password)

            existing_file = db.query(Files).filter(Files.file_id == file_hash).first()
            if not existing_file:
                new_file = Files(
                    file_id=file_hash,
                    file_data=encrypted_file_data["encrypted_file_data"],
                    iv=encrypted_file_data["iv"],
                )

                db.add(new_file)
                db.commit()

            expiry_timestamp = datetime.now(timezone.utc) + timedelta(
                days=file_upload_dto.expiration
            )

            file_logs.append(FileLogs(
                name=file_upload_dto.file_names[index],
                size=file_upload_dto.file_sizes[index],
                from_email=user_email,
                to_email=file_upload_dto.recipient_email,
                sent_on=datetime.now(timezone.utc),
                expiry=expiry_timestamp,
                download_count=file_upload_dto.download_count,
                file_id=file_hash,
                is_anonymous=file_upload_dto.anonymous,
                status="active",
            ))

        db.add_all(file_logs)
        db.commit()

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400, detail="Invalid JSON format in FileSignature"
        )
    except ValueError as error:
        raise ValueError(str(error))
    except Exception as error:
        print(error)
        db.rollback()
        raise HTTPException(status_code=400, detail=str(error))


def get_files_actitvity(user_email: str):
    db = next(get_db_session())
    files = (
        db.query(FileLogs)
        .filter((FileLogs.from_email == user_email) | (FileLogs.to_email == user_email))
        .order_by(FileLogs.sent_on.desc())
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
            FileLogs.name,
            FileLogs.size,
            FileLogs.sent_on.label("received_on"),
            FileLogs.from_email.label("received_from"),
            FileLogs.expiry,
            FileLogs.is_anonymous,
        )
        .filter(
            FileLogs.to_email == user_email,
            FileLogs.status == "active",
            FileLogs.expiry > datetime.datetime.now(),
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
            FileLogs.name,
            FileLogs.size,
            FileLogs.sent_on.label("received_on"),
            FileLogs.to_email.label("received_from"),
            FileLogs.expiry,
            FileLogs.is_anonymous,
        )
        .filter(
            FileLogs.from_email == user_email,
            FileLogs.status == "active",
            FileLogs.expiry > datetime.datetime.now(),
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
