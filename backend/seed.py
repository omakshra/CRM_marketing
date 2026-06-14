import random
from datetime import datetime, timedelta, timezone

from app.database.session import SessionLocal, init_db
from app.models import Customer
from app.database.crud import campaign as campaign_crud
from app.database.crud import campaign_recipient as recipient_crud

FIRST_NAMES = [
    "Aarav", "Vihaan", "Ananya", "Isha", "Rohan", "Priya", "Kabir", "Meera",
    "Arjun", "Sneha", "Dev", "Kavya", "Rahul", "Nisha", "Aditya", "Pooja",
    "Vikram", "Shreya", "Karan", "Divya", "Manish", "Neha", "Suresh", "Ritu",
]

LAST_NAMES = [
    "Sharma", "Patel", "Reddy", "Iyer", "Gupta", "Singh", "Khan", "Das",
    "Nair", "Mehta", "Verma", "Joshi", "Malhotra", "Chopra", "Bose", "Rao",
]

CITIES = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad",
]

CHANNELS = ["email", "sms", "whatsapp", "push"]


def generate_customers(count: int = 100) -> list[Customer]:
    customers: list[Customer] = []
    used_emails: set[str] = set()

    for index in range(count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        name = f"{first_name} {last_name}"
        email_base = f"{first_name.lower()}.{last_name.lower()}{index}"
        email = f"{email_base}@example.com"

        while email in used_emails:
            email = f"{email_base}{random.randint(10, 99)}@example.com"
        used_emails.add(email)

        purchase_count = random.randint(1, 12)
        average_order_value = round(random.uniform(500, 8000), 2)
        total_spend = round(average_order_value * purchase_count * random.uniform(0.8, 1.2), 2)
        inactive_days = random.randint(30, 365)
        last_purchase_date = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=inactive_days)

        customers.append(
            Customer(
                name=name,
                email=email,
                total_spend=total_spend,
                purchase_count=purchase_count,
                average_order_value=average_order_value,
                city=random.choice(CITIES),
                channel_preference=random.choice(CHANNELS),
                last_purchase_date=last_purchase_date,
            )
        )

    return customers


def seed_database(customer_count: int = 100) -> None:
    init_db()
    db = SessionLocal()

    try:
        existing_count = db.query(Customer).count()
        seed_customers = existing_count == 0

        if not seed_customers:
            print(f"Database already contains {existing_count} customers. Skipping customer seed.")
        else:
            customers = generate_customers(customer_count)
            db.add_all(customers)
            db.commit()
            print(f"Seeded {customer_count} customers successfully.")

        # Create a few sample campaigns and assign recipients (always attempt)
        try:
            customer_ids = [c.id for c in db.query(Customer.id).all()]
            if customer_ids:
                sample_campaigns = [
                    ("Welcome Series", "Hi {{name}}, welcome to our store!"),
                    ("Re-engage", "Hi {{name}}, we've missed you—here's 10% off."),
                    ("Top Spenders", "Hi {{name}}, thanks for being a top customer!"),
                ]
                import random

                for name, template in sample_campaigns:
                    campaign = campaign_crud.create_campaign(db=db, name=name, message_template=template)
                    recipients = random.sample(customer_ids, k=min(10, len(customer_ids)))
                    recipient_crud.add_campaign_recipients(db, campaign.id, recipients)
                print("Seeded sample campaigns and recipients.")
            else:
                print("No customers available to assign as campaign recipients.")
        except Exception:
            print("Campaign seeding skipped due to an error.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
