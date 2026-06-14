from sqlalchemy.orm import Session

from app.database.crud import campaign as campaign_crud
from app.database.crud import communication_log as log_crud
from app.database.crud import customer as customer_crud
from app.models import CommunicationLog
from app.services.event_simulator_service import simulate_customer_events, utc_now


def deliver_campaign(db: Session, campaign_id: int, customer_ids: list[int]) -> None:
    campaign = campaign_crud.get_campaign_by_id(db, campaign_id)
    if campaign is None:
        return

    customers = customer_crud.get_customers_by_ids(db, customer_ids)
    if not customers:
        campaign_crud.update_campaign_status(db, campaign, "failed")
        return

    base_time = utc_now()
    logs: list[CommunicationLog] = []

    for index, customer in enumerate(customers):
        logs.extend(
            simulate_customer_events(
                campaign_id=campaign_id,
                customer_id=customer.id,
                base_time=base_time,
                offset_seconds=index,
            )
        )

    log_crud.create_communication_logs_bulk(db, logs)
    campaign_crud.update_campaign_status(db, campaign, "sent", sent_at=utc_now())
