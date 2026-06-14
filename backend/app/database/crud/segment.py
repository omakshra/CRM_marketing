import json

from sqlalchemy.orm import Session

from app.models import Segment
from app.schemas.segment import SegmentFilter


def create_segment(
    db: Session,
    nl_query: str,
    filters: SegmentFilter,
    customer_count: int,
) -> Segment:
    segment = Segment(
        nl_query=nl_query,
        filter_json=json.dumps(filters.model_dump(exclude_none=True)),
        customer_count=customer_count,
    )
    db.add(segment)
    db.commit()
    db.refresh(segment)
    return segment


def get_segment_by_id(db: Session, segment_id: int) -> Segment | None:
    return db.query(Segment).filter(Segment.id == segment_id).first()
