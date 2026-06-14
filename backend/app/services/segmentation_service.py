import re

from app.schemas.segment import SegmentFilter
from app.services.gemini_service import is_gemini_configured, parse_segmentation_query


def parse_natural_language_query(query: str) -> SegmentFilter:
    """Rule-based fallback when Gemini is unavailable."""
    normalized = query.lower()
    filters: dict[str, float | int | str] = {}

    spend_patterns = [
        (
            r"(?:spent|spend|spending)\s+(?:more\s+than|over|above|greater\s+than)\s+(?:₹|rs\.?|inr\s*)?(\d+(?:\.\d+)?)",
            "min_spend",
        ),
        (
            r"(?:spent|spend|spending)\s+(?:less\s+than|under|below)\s+(?:₹|rs\.?|inr\s*)?(\d+(?:\.\d+)?)",
            "max_spend",
        ),
        (
            r"(?:minimum|min)\s+(?:spend|spent)\s+(?:of\s+)?(?:₹|rs\.?|inr\s*)?(\d+(?:\.\d+)?)",
            "min_spend",
        ),
    ]
    for pattern, key in spend_patterns:
        match = re.search(pattern, normalized)
        if match:
            filters[key] = float(match.group(1))
            break

    inactive_patterns = [
        r"(?:inactive|haven't\s+purchased|hasn't\s+purchased|not\s+purchased|no\s+purchase)\s+(?:for|in|since)\s+(\d+)\s+days?",
        r"(?:last\s+purchase|purchased)\s+(?:was\s+)?(?:more\s+than|over|at\s+least)\s+(\d+)\s+days?\s+ago",
        r"(\d+)\s+days?\s+(?:inactive|without\s+purchase)",
    ]
    for pattern in inactive_patterns:
        match = re.search(pattern, normalized)
        if match:
            filters["inactive_days"] = int(match.group(1))
            break

    purchase_patterns = [
        (r"(?:purchase\s+count|purchases?)\s+(?:at\s+least|>=|more\s+than|over)\s+(\d+)", "min_purchase_count"),
        (r"(?:at\s+least|minimum)\s+(\d+)\s+purchases?", "min_purchase_count"),
    ]
    for pattern, key in purchase_patterns:
        match = re.search(pattern, normalized)
        if match:
            filters[key] = int(match.group(1))
            break

    city_match = re.search(r"(?:in|from|city\s+is)\s+([a-zA-Z\s]+?)(?:\s+and|\s+who|\s+with|$)", normalized)
    if city_match:
        city = city_match.group(1).strip()
        if city and city not in {"customers", "customer"}:
            filters["city"] = city.title()

    channel_match = re.search(
        r"(?:prefer|preference|via|through|channel)\s+(email|sms|whatsapp|push)",
        normalized,
    )
    if channel_match:
        filters["channel_preference"] = channel_match.group(1)

    return SegmentFilter(**filters)


async def convert_query_to_filters(query: str) -> tuple[SegmentFilter, str]:
    if is_gemini_configured():
        try:
            filters = await parse_segmentation_query(query)
            return filters, "gemini"
        except Exception:
            pass

    return parse_natural_language_query(query), "fallback"
