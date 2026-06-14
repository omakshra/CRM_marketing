import random
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from app.models import CommunicationLog

EVENT_SENT = "sent"
EVENT_OPENED = "opened"
EVENT_CLICKED = "clicked"
EVENT_FAILED = "failed"

VALID_STATUSES = {EVENT_SENT, EVENT_OPENED, EVENT_CLICKED, EVENT_FAILED}


@dataclass(frozen=True)
class SimulationWeights:
    failed_rate: float = 0.08
    opened_rate: float = 0.72
    click_rate_given_open: float = 0.35


DEFAULT_WEIGHTS = SimulationWeights()


def simulate_customer_events(
    campaign_id: int,
    customer_id: int,
    base_time: datetime,
    offset_seconds: int = 0,
    weights: SimulationWeights = DEFAULT_WEIGHTS,
) -> list[CommunicationLog]:
    sent_time = base_time + timedelta(seconds=offset_seconds)
    events = [
        CommunicationLog(
            campaign_id=campaign_id,
            customer_id=customer_id,
            status=EVENT_SENT,
            event_time=sent_time,
        )
    ]

    roll = random.random()
    if roll < weights.failed_rate:
        events.append(
            CommunicationLog(
                campaign_id=campaign_id,
                customer_id=customer_id,
                status=EVENT_FAILED,
                event_time=sent_time + timedelta(seconds=5),
            )
        )
        return events

    if roll < weights.opened_rate:
        opened_time = sent_time + timedelta(minutes=random.randint(10, 180))
        events.append(
            CommunicationLog(
                campaign_id=campaign_id,
                customer_id=customer_id,
                status=EVENT_OPENED,
                event_time=opened_time,
            )
        )

        if random.random() < weights.click_rate_given_open:
            events.append(
                CommunicationLog(
                    campaign_id=campaign_id,
                    customer_id=customer_id,
                    status=EVENT_CLICKED,
                    event_time=sent_time + timedelta(minutes=random.randint(20, 240)),
                )
            )

    return events


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)
