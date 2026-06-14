from sqlalchemy.orm import Session

from app.database.crud import communication_log as log_crud
from app.schemas.analytics import AnalyticsResponse
from app.schemas.campaign import CampaignAnalyticsResponse


def calculate_rates(sent: int, opened: int, clicked: int) -> tuple[float, float]:
    open_rate = round((opened / sent) * 100, 2) if sent else 0.0
    click_rate = round((clicked / opened) * 100, 2) if opened else 0.0
    return open_rate, click_rate


def build_analytics_response(counts: dict[str, int]) -> AnalyticsResponse:
    sent = counts.get("sent", 0)
    opened = counts.get("opened", 0)
    clicked = counts.get("clicked", 0)
    failed = counts.get("failed", 0)
    open_rate, click_rate = calculate_rates(sent, opened, clicked)

    return AnalyticsResponse(
        sent=sent,
        opened=opened,
        clicked=clicked,
        failed=failed,
        open_rate=open_rate,
        click_rate=click_rate,
    )


def get_global_analytics(db: Session) -> AnalyticsResponse:
    counts = log_crud.get_analytics_counts(db)
    return build_analytics_response(counts)


def get_campaign_analytics(db: Session, campaign_id: int) -> CampaignAnalyticsResponse:
    counts = log_crud.get_campaign_analytics_counts(db, campaign_id)
    analytics = build_analytics_response(counts)
    return CampaignAnalyticsResponse(
        campaign_id=campaign_id,
        sent=analytics.sent,
        opened=analytics.opened,
        clicked=analytics.clicked,
        failed=analytics.failed,
        open_rate=analytics.open_rate,
        click_rate=analytics.click_rate,
    )
