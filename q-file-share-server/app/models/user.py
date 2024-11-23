from app.db.config import Base

from sqlalchemy import Column, Integer, String, TIMESTAMP

class User(Base):
    __tablename__ = "Users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)
