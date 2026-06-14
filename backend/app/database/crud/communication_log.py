from datetime import datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import CommunicationLog


def create_communication_log(
    db: Session,
    campaign_id: int,
    customer_id: int,
    status: str,
    event_time: datetime | None = None,
) -> CommunicationLog:
    log = CommunicationLog(
        campaign_id=campaign_id,
        customer_id=customer_id,
        status=status,
        event_time=event_time or datetime.utcnow(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def create_communication_logs_bulk(db: Session, logs: list[CommunicationLog]) -> None:
    db.add_all(logs)
    db.commit()


def get_analytics_counts(db: Session) -> dict[str, int]:
    rows = (
        db.query(CommunicationLog.status, func.count(CommunicationLog.id))
        .group_by(CommunicationLog.status)
        .all()
    )
    counts = {"sent": 0, "opened": 0, "clicked": 0, "failed": 0}
    for status, count in rows:
        if status in counts:
            counts[status] = count
    return counts


def get_campaign_analytics_counts(db: Session, campaign_id: int) -> dict[str, int]:
    rows = (
        db.query(CommunicationLog.status, func.count(CommunicationLog.id))
        .filter(CommunicationLog.campaign_id == campaign_id)
        .group_by(CommunicationLog.status)
        .all()
    )
    counts = {"sent": 0, "opened": 0, "clicked": 0, "failed": 0}
    for status, count in rows:
        if status in counts:
            counts[status] = count
    return counts
