import json

from fastapi import BackgroundTasks, HTTPException, status
from sqlalchemy.orm import Session

from app.database.crud import campaign as campaign_crud
from app.database.crud import campaign_recipient as recipient_crud
from app.database.crud import customer as customer_crud
from app.database.crud import segment as segment_crud
from app.database.session import SessionLocal
from app.models import Campaign
from app.schemas.campaign import CampaignSendResponse
from app.schemas.segment import SegmentFilter
from app.services.channel_service import deliver_campaign


def resolve_campaign_customer_ids(db: Session, campaign: Campaign) -> list[int]:
    recipient_ids = recipient_crud.get_campaign_recipient_ids(db, campaign.id)
    if recipient_ids:
        return recipient_ids

    if campaign.segment_id is None:
        return []

    segment = segment_crud.get_segment_by_id(db, campaign.segment_id)
    if segment is None:
        return []

    filters = SegmentFilter(**json.loads(segment.filter_json))
    matched_customers = customer_crud.get_customers_by_filters(db, filters)
    return [customer.id for customer in matched_customers]


def send_campaign_background(campaign_id: int, customer_ids: list[int]) -> None:
    db = SessionLocal()
    try:
        deliver_campaign(db, campaign_id, customer_ids)
    finally:
        db.close()


def enqueue_campaign_send(
    db: Session,
    campaign_id: int,
    background_tasks: BackgroundTasks,
) -> CampaignSendResponse:
    campaign = campaign_crud.get_campaign_by_id(db, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    if campaign.status == "sent":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Campaign already sent")

    if campaign.status == "sending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Campaign is already sending")

    customer_ids = resolve_campaign_customer_ids(db, campaign)
    if not customer_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign has no customers. Link a segment or select recipients.",
        )

    campaign_crud.update_campaign_status(db, campaign, "sending")
    background_tasks.add_task(send_campaign_background, campaign_id, customer_ids)

    return CampaignSendResponse(
        campaign_id=campaign_id,
        status="sending",
        message=f"Campaign delivery started for {len(customer_ids)} customers",
    )
