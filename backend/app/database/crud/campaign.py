from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models import Campaign


def create_campaign(
    db: Session,
    name: str,
    message_template: str,
    segment_id: int | None = None,
) -> Campaign:
    campaign = Campaign(
        name=name,
        segment_id=segment_id,
        message_template=message_template,
        status="draft",
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


def get_campaigns(db: Session, skip: int = 0, limit: int = 100) -> tuple[list[Campaign], int]:
    query = db.query(Campaign).order_by(Campaign.created_at.desc())
    total = query.count()
    campaigns = query.offset(skip).limit(limit).all()
    return campaigns, total


def get_campaign_by_id(db: Session, campaign_id: int) -> Campaign | None:
    return db.query(Campaign).filter(Campaign.id == campaign_id).first()


def update_campaign_status(
    db: Session,
    campaign: Campaign,
    status: str,
    sent_at: datetime | None = None,
) -> Campaign:
    campaign.status = status
    if sent_at is not None:
        campaign.sent_at = sent_at
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign
