from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class SegmentFilter(BaseModel):
    min_spend: float | None = Field(default=None, ge=0)
    max_spend: float | None = Field(default=None, ge=0)
    inactive_days: int | None = Field(default=None, ge=0)
    min_purchase_count: int | None = Field(default=None, ge=0)
    max_purchase_count: int | None = Field(default=None, ge=0)
    city: str | None = None
    channel_preference: str | None = None


class SegmentCreateRequest(BaseModel):
    query: str = Field(min_length=3)


class SegmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nl_query: str
    filter_json: dict[str, Any]
    customer_count: int
    created_at: datetime


class WinBackInsight(BaseModel):
    reason: str
    recommendation: str


class ScoredCustomerResponse(BaseModel):
    customer: dict[str, Any]
    score: int
    reason: str | None = None
    recommendation: str | None = None


class SegmentSummary(BaseModel):
    customer_count: int
    average_spend: float
    average_score: float
    potential_revenue_recovery: float


class SegmentCreateResponse(BaseModel):
    segment: SegmentResponse
    filters: SegmentFilter
    filter_source: str
    summary: SegmentSummary
    customers: list[ScoredCustomerResponse]
    potential_revenue_recovery: float
