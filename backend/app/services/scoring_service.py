from datetime import datetime, timezone


def calculate_winback_score(total_spend: float, purchase_count: int, last_purchase_date: datetime) -> int:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    days_since_last_purchase = (now - last_purchase_date).days

    if days_since_last_purchase < 120:
        recency_score = 40
    elif days_since_last_purchase <= 180:
        recency_score = 25
    else:
        recency_score = 10

    if total_spend > 10000:
        spend_score = 30
    elif total_spend > 5000:
        spend_score = 20
    else:
        spend_score = 10

    if purchase_count >= 5:
        purchase_score = 30
    elif purchase_count >= 2:
        purchase_score = 20
    else:
        purchase_score = 10

    return min(recency_score + spend_score + purchase_score, 100)


def score_badge(score: int) -> str:
    if score >= 70:
        return "green"
    if score >= 40:
        return "yellow"
    return "red"
