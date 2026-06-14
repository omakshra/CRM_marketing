from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base

if TYPE_CHECKING:
    from app.models.customer import Campaign, Customer


class CampaignRecipient(Base):
    __tablename__ = "campaign_recipients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(Integer, ForeignKey("campaigns.id"), nullable=False, index=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("customers.id"), nullable=False, index=True)

    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="recipients")
    customer: Mapped["Customer"] = relationship("Customer")
