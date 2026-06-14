from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    total_spend: float = Field(ge=0)
    purchase_count: int = Field(ge=0)
    average_order_value: float = Field(ge=0)
    city: str
    channel_preference: str
    last_purchase_date: datetime


class CustomerResponse(CustomerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class CustomerListResponse(BaseModel):
    total: int
    customers: list[CustomerResponse]
