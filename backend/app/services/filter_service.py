from datetime import datetime, timezone

from sqlalchemy.orm import Query

from app.models import Customer
from app.schemas.segment import SegmentFilter


def apply_filters(query: Query, filters: SegmentFilter) -> Query:
    if filters.min_spend is not None:
        query = query.filter(Customer.total_spend > filters.min_spend)

    if filters.max_spend is not None:
        query = query.filter(Customer.total_spend <= filters.max_spend)

    if filters.inactive_days is not None:
        cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - __days_to_timedelta(filters.inactive_days)
        query = query.filter(Customer.last_purchase_date <= cutoff)

    if filters.min_purchase_count is not None:
        query = query.filter(Customer.purchase_count >= filters.min_purchase_count)

    if filters.max_purchase_count is not None:
        query = query.filter(Customer.purchase_count <= filters.max_purchase_count)

    if filters.city is not None:
        query = query.filter(Customer.city.ilike(f"%{filters.city}%"))

    if filters.channel_preference is not None:
        query = query.filter(Customer.channel_preference.ilike(filters.channel_preference))

    return query


def __days_to_timedelta(days: int):
    from datetime import timedelta

    return timedelta(days=days)
