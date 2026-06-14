import asyncio
import json
import logging

import google.generativeai as genai

from app.config import settings
from app.schemas.segment import SegmentFilter, WinBackInsight
from app.services.prompts.explanation import EXPLANATION_SYSTEM_PROMPT
from app.services.prompts.segmentation import SEGMENTATION_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

_insight_semaphore = asyncio.Semaphore(10)


def is_gemini_configured() -> bool:
    return bool(settings.gemini_api_key.strip())


def _configure_gemini() -> genai.GenerativeModel:
    if not is_gemini_configured():
        raise ValueError("GEMINI_API_KEY is not configured")
    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel(settings.gemini_model)


def extract_json(text: str) -> dict:
    cleaned = (text or "").strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in Gemini response")
    return json.loads(cleaned[start : end + 1])


async def parse_segmentation_query(query: str) -> SegmentFilter:
    model = _configure_gemini()
    prompt = f"{SEGMENTATION_SYSTEM_PROMPT}\n\nMarketer query:\n{query}"
    response = await model.generate_content_async(prompt)
    payload = extract_json(response.text)
    return SegmentFilter(**payload)


async def generate_winback_insight(customer_data: dict, score: int) -> WinBackInsight:
    async with _insight_semaphore:
        try:
            model = _configure_gemini()
            customer_context = {
                "name": customer_data.get("name"),
                "email": customer_data.get("email"),
                "total_spend": customer_data.get("total_spend"),
                "purchase_count": customer_data.get("purchase_count"),
                "average_order_value": customer_data.get("average_order_value"),
                "city": customer_data.get("city"),
                "channel_preference": customer_data.get("channel_preference"),
                "last_purchase_date": customer_data.get("last_purchase_date"),
            }
            prompt = (
                f"{EXPLANATION_SYSTEM_PROMPT}\n\n"
                f"Customer data: {json.dumps(customer_context)}\n"
                f"Win-back score: {score}/100"
            )
            response = await model.generate_content_async(prompt)
            payload = extract_json(response.text)
            return WinBackInsight(
                reason=str(payload.get("reason", "")).strip(),
                recommendation=str(payload.get("recommendation", "")).strip(),
            )
        except Exception as exc:
            if is_gemini_configured():
                logger.warning(
                    "Gemini insight fallback for %s: %s",
                    customer_data.get("email"),
                    exc,
                )
            return _fallback_insight(customer_data, score)


def _fallback_insight(customer_data: dict, score: int) -> WinBackInsight:
    name = customer_data.get("name", "Customer")
    spend = customer_data.get("total_spend", 0)
    if score >= 70:
        return WinBackInsight(
            reason=f"{name} has strong historical spend (₹{spend:.0f}) and favorable engagement signals.",
            recommendation="Offer a VIP win-back incentive on their preferred channel within 48 hours.",
        )
    if score >= 40:
        return WinBackInsight(
            reason=f"{name} shows moderate win-back potential with ₹{spend:.0f} lifetime spend.",
            recommendation="Send a reminder campaign with a limited-time offer.",
        )
    return WinBackInsight(
        reason=f"{name} has lower win-back potential based on spend and recency.",
        recommendation="Include in a low-cost nurture sequence before high-incentive outreach.",
    )
