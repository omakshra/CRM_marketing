from app.schemas.analytics import AnalyticsResponse
from app.schemas.campaign import (
    CampaignAnalyticsResponse,
    CampaignCreateRequest,
    CampaignListResponse,
    CampaignResponse,
    CampaignSendResponse,
)
from app.schemas.customer import CustomerListResponse, CustomerResponse
from app.schemas.segment import (
    SegmentCreateRequest,
    SegmentCreateResponse,
    SegmentFilter,
    SegmentResponse,
    ScoredCustomerResponse,
    SegmentSummary,
    WinBackInsight,
)

__all__ = [
    "AnalyticsResponse",
    "CampaignAnalyticsResponse",
    "CampaignCreateRequest",
    "CampaignListResponse",
    "CampaignResponse",
    "CampaignSendResponse",
    "CustomerListResponse",
    "CustomerResponse",
    "SegmentCreateRequest",
    "SegmentCreateResponse",
    "SegmentFilter",
    "SegmentResponse",
    "ScoredCustomerResponse",
    "SegmentSummary",
    "WinBackInsight",
]
