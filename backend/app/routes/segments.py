import asyncio
import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.crud import customer as customer_crud
from app.database.crud import segment as segment_crud
from app.database.session import get_db
from app.schemas.customer import CustomerResponse
from app.schemas.segment import (
    ScoredCustomerResponse,
    SegmentCreateRequest,
    SegmentCreateResponse,
    SegmentResponse,
    SegmentSummary,
)
from app.services.gemini_service import generate_winback_insight
from app.services.scoring_service import calculate_winback_score
from app.services.segmentation_service import convert_query_to_filters

router = APIRouter(tags=["segments"])

REVENUE_RECOVERY_RATE = 0.15


async def _score_customer(customer) -> ScoredCustomerResponse:
    score = calculate_winback_score(
        total_spend=customer.total_spend,
        purchase_count=customer.purchase_count,
        last_purchase_date=customer.last_purchase_date,
    )
    customer_payload = CustomerResponse.model_validate(customer).model_dump(mode="json")
    insight = await generate_winback_insight(customer_payload, score)

    return ScoredCustomerResponse(
        customer=customer_payload,
        score=score,
        reason=insight.reason,
        recommendation=insight.recommendation,
    )


@router.post("/segment", response_model=SegmentCreateResponse)
async def create_segment(
    payload: SegmentCreateRequest,
    db: Session = Depends(get_db),
) -> SegmentCreateResponse:
    filters, filter_source = await convert_query_to_filters(payload.query)
    matched_customers = customer_crud.get_customers_by_filters(db, filters)

    segment = segment_crud.create_segment(
        db=db,
        nl_query=payload.query,
        filters=filters,
        customer_count=len(matched_customers),
    )

    scored_customers = await asyncio.gather(*[_score_customer(customer) for customer in matched_customers])
    scored_customers = sorted(scored_customers, key=lambda item: item.score, reverse=True)

    total_score = sum(item.score for item in scored_customers)
    average_spend = (
        sum(customer.total_spend for customer in matched_customers) / len(matched_customers)
        if matched_customers
        else 0.0
    )
    average_score = total_score / len(matched_customers) if matched_customers else 0.0
    potential_revenue_recovery = round(
        sum(customer.total_spend for customer in matched_customers) * REVENUE_RECOVERY_RATE,
        2,
    )

    return SegmentCreateResponse(
        segment=SegmentResponse(
            id=segment.id,
            nl_query=segment.nl_query,
            filter_json=json.loads(segment.filter_json),
            customer_count=segment.customer_count,
            created_at=segment.created_at,
        ),
        filters=filters,
        filter_source=filter_source,
        summary=SegmentSummary(
            customer_count=len(matched_customers),
            average_spend=round(average_spend, 2),
            average_score=round(average_score, 2),
            potential_revenue_recovery=potential_revenue_recovery,
        ),
        customers=list(scored_customers),
        potential_revenue_recovery=potential_revenue_recovery,
    )
