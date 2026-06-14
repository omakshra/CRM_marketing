import json

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.crud import campaign as campaign_crud
from app.database.crud import campaign_recipient as recipient_crud
from app.database.crud import customer as customer_crud
from app.database.crud import segment as segment_crud
from app.database.session import get_db
from app.schemas.campaign import (
    CampaignAnalyticsResponse,
    CampaignCreateRequest,
    CampaignListResponse,
    CampaignResponse,
    CampaignSendResponse,
)
from app.schemas.segment import SegmentFilter
from app.services.analytics_service import get_campaign_analytics
from app.services.campaign_service import enqueue_campaign_send

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("", response_model=CampaignListResponse)
def list_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> CampaignListResponse:
    campaigns, total = campaign_crud.get_campaigns(db, skip=skip, limit=limit)
    return CampaignListResponse(
        total=total,
        campaigns=[CampaignResponse.model_validate(campaign) for campaign in campaigns],
    )


@router.post("", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CampaignCreateRequest, db: Session = Depends(get_db)) -> CampaignResponse:
    if payload.segment_id is not None and segment_crud.get_segment_by_id(db, payload.segment_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Segment not found")

    campaign = campaign_crud.create_campaign(
        db=db,
        name=payload.name,
        message_template=payload.message_template,
        segment_id=payload.segment_id,
    )

    customer_ids = payload.customer_ids
    if not customer_ids and payload.segment_id is not None:
        segment = segment_crud.get_segment_by_id(db, payload.segment_id)
        if segment is not None:
            filters = SegmentFilter(**json.loads(segment.filter_json))
            matched_customers = customer_crud.get_customers_by_filters(db, filters)
            customer_ids = [customer.id for customer in matched_customers]

    if customer_ids:
        existing_ids = {customer.id for customer in customer_crud.get_customers_by_ids(db, customer_ids)}
        missing_ids = set(customer_ids) - existing_ids
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customers not found: {sorted(missing_ids)}",
            )
        recipient_crud.add_campaign_recipients(db, campaign.id, customer_ids)

    return CampaignResponse.model_validate(campaign)


@router.post("/{campaign_id}/send", response_model=CampaignSendResponse)
def send_campaign(
    campaign_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> CampaignSendResponse:
    return enqueue_campaign_send(db, campaign_id, background_tasks)


@router.get("/{campaign_id}/analytics", response_model=CampaignAnalyticsResponse)
def get_campaign_analytics_route(campaign_id: int, db: Session = Depends(get_db)) -> CampaignAnalyticsResponse:
    campaign = campaign_crud.get_campaign_by_id(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    return get_campaign_analytics(db, campaign_id)
