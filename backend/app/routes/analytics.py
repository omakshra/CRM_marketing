from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import get_global_analytics

router = APIRouter(tags=["analytics"])


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)) -> AnalyticsResponse:
    return get_global_analytics(db)
