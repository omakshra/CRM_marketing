from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.crud import customer as customer_crud
from app.database.session import get_db
from app.schemas.customer import CustomerListResponse, CustomerResponse

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("", response_model=CustomerListResponse)
def list_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> CustomerListResponse:
    customers, total = customer_crud.get_customers(db, skip=skip, limit=limit)
    return CustomerListResponse(
        total=total,
        customers=[CustomerResponse.model_validate(customer) for customer in customers],
    )
