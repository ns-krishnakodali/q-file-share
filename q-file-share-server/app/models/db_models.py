from app.db.config import Base

from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, func


class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)


class FileLog(Base):
    __tablename__ = "FileLog"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    size = Column(Integer, nullable=False)
    from_email = Column(String)
    to_email = Column(String)
    sent_on = Column(TIMESTAMP)
    expiry = Column(TIMESTAMP)
    download_count = Column(Integer, default=10)
    file_id = Column(String, unique=True)
    is_anonymous = Column(Boolean, default=False)
    status = Column(String, default="active")
    updated_at = Column(TIMESTAMP, onupdate=func.now())
