from pydantic import BaseModel

from typing import Tuple, List


class LoginRequest(BaseModel):
    email: str
    password: str


class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str


class Payload(BaseModel):
    message: str
    signature: Tuple[List[List[int]], str]
    publicKey: Tuple[List[List[List[int]]], List[List[int]]]
