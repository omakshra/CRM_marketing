from pydantic import BaseModel


class AnalyticsResponse(BaseModel):
    sent: int
    opened: int
    clicked: int
    failed: int
    open_rate: float
    click_rate: float
