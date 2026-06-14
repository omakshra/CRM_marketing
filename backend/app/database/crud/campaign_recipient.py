from sqlalchemy.orm import Session

from app.models import CampaignRecipient


def add_campaign_recipients(db: Session, campaign_id: int, customer_ids: list[int]) -> None:
    recipients = [
        CampaignRecipient(campaign_id=campaign_id, customer_id=customer_id)
        for customer_id in customer_ids
    ]
    db.add_all(recipients)
    db.commit()


def get_campaign_recipient_ids(db: Session, campaign_id: int) -> list[int]:
    rows = (
        db.query(CampaignRecipient.customer_id)
        .filter(CampaignRecipient.campaign_id == campaign_id)
        .all()
    )
    return [row[0] for row in rows]
