from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    total_spend: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    purchase_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    average_order_value: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    channel_preference: Mapped[str] = mapped_column(String(50), nullable=False)
    last_purchase_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    communication_logs: Mapped[list["CommunicationLog"]] = relationship(
        "CommunicationLog", back_populates="customer"
    )


class Segment(Base):
    __tablename__ = "segments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nl_query: Mapped[str] = mapped_column(Text, nullable=False)
    filter_json: Mapped[str] = mapped_column(Text, nullable=False)
    customer_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    campaigns: Mapped[list["Campaign"]] = relationship("Campaign", back_populates="segment")


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    segment_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("segments.id"), nullable=True)
    message_template: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    segment: Mapped["Segment | None"] = relationship("Segment", back_populates="campaigns")
    communication_logs: Mapped[list["CommunicationLog"]] = relationship(
        "CommunicationLog", back_populates="campaign"
    )
    recipients: Mapped[list["CampaignRecipient"]] = relationship(
        "CampaignRecipient", back_populates="campaign"
    )


class CommunicationLog(Base):
    __tablename__ = "communication_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(Integer, ForeignKey("campaigns.id"), nullable=False, index=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    event_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    campaign: Mapped["Campaign"] = relationship("Campaign", back_populates="communication_logs")
    customer: Mapped["Customer"] = relationship("Customer", back_populates="communication_logs")
