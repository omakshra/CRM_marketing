from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CampaignCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    segment_id: int | None = None
    message_template: str = Field(min_length=1)
    customer_ids: list[int] = Field(default_factory=list)


class CampaignResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    segment_id: int | None
    message_template: str
    status: str
    created_at: datetime
    sent_at: datetime | None = None


class CampaignListResponse(BaseModel):
    total: int
    campaigns: list[CampaignResponse]


class CampaignSendResponse(BaseModel):
    campaign_id: int
    status: str
    message: str


class CampaignAnalyticsResponse(BaseModel):
    campaign_id: int
    sent: int
    opened: int
    clicked: int
    failed: int
    open_rate: float
    click_rate: float
