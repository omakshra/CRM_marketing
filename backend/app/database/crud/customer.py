from sqlalchemy.orm import Session

from app.models import Customer
from app.schemas.segment import SegmentFilter
from app.services.filter_service import apply_filters


def get_customers(db: Session, skip: int = 0, limit: int = 100) -> tuple[list[Customer], int]:
    query = db.query(Customer).order_by(Customer.id)
    total = query.count()
    customers = query.offset(skip).limit(limit).all()
    return customers, total


def get_customer_by_id(db: Session, customer_id: int) -> Customer | None:
    return db.query(Customer).filter(Customer.id == customer_id).first()


def get_customers_by_ids(db: Session, customer_ids: list[int]) -> list[Customer]:
    if not customer_ids:
        return []
    return db.query(Customer).filter(Customer.id.in_(customer_ids)).all()


def get_customers_by_filters(db: Session, filters: SegmentFilter) -> list[Customer]:
    query = db.query(Customer)
    return apply_filters(query, filters).order_by(Customer.total_spend.desc()).all()


def create_customers_bulk(db: Session, customers: list[Customer]) -> None:
    db.add_all(customers)
    db.commit()
