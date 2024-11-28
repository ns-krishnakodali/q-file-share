from datetime import datetime

from pydantic import ConfigDict, BaseModel, Field


class ActivitiesResponse(BaseModel):
    name: str
    received_from: str = Field(alias="from_email")
    sent_to: str = Field(alias="to_email")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ReceivedFilesResponse(BaseModel):
    name: str
    size: int
    received_from: str = Field(alias="from_email")
    received_on: datetime
    expiry: datetime
    download_count: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SharedFilesResponse(BaseModel):
    name: str
    size: int
    sent_to: str = Field(alias="to_email")
    sent_on: datetime
    expiry: datetime
    download_count: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
