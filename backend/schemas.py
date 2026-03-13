from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

# Report Schemas
class ReportBase(BaseModel):
    type: str # e.g., "diabetes" or "heart"
    prediction: int
    risk_percentage: float
    data: List # The input data used for prediction

class ReportCreate(ReportBase):
    user_id: str

class ReportResponse(ReportBase):
    id: str = Field(alias="_id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ChatQuery(BaseModel):
    query: str
