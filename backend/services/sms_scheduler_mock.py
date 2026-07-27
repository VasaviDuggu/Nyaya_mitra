import os
import json
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add absolute path imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'data', 'nyayamitra.db')}"

def run_scheduler_alert_checks():
    """
    Simulates a background cron job checking for upcoming notice milestones
    and dispatching simulated SMS/WhatsApp alerts via terminal logging.
    """
    print("----------------------------------------------------------------------")
    print("NYAYAMITRA SCHEDULER: Initiating active database scan for notice alerts...")
    print("----------------------------------------------------------------------")
    
    if not os.path.exists(os.path.join(BASE_DIR, 'data', 'nyayamitra.db')):
        print("Scheduler Notice: SQLite database file not found. Skipping scan.")
        return

    # Setup local SQLAlchemy session
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Import models inside function to avoid circular imports
        import sys
        sys.path.append(BASE_DIR)
        import models

        # Query all documents in SQLite
        documents = session.query(models.Document).all()
        active_alerts_sent = 0

        for doc in documents:
            if not doc.extracted_dates_json:
                continue

            try:
                milestones = json.loads(doc.extracted_dates_json)
            except Exception:
                continue

            for milestone in milestones:
                date_str = milestone.get("date", "")
                title = milestone.get("title", "Deadline")
                
                if not date_str:
                    continue

                try:
                    target_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                    today = datetime.date.today()
                    delta = target_date - today
                    days_remaining = delta.days

                    # Trigger alert if deadline is close (e.g., within 3 days or today)
                    if 0 <= days_remaining <= 3:
                        active_alerts_sent += 1
                        print(f"\n[ALERT MATCHED] Document ID: #{doc.id} | notice: '{doc.filename}'")
                        print(f"  * Milestone: '{title}' is set for {date_str} ({days_remaining} days left!)")
                        print(f"  * Simulating dispatch trigger to Twilio API...")
                        print(f"  * [DISPATCH SUCCESS] SMS/WhatsApp sent to +9199********:")
                        print(f"    \"NyayaMitra Alert: Your '{title}' for notice '{doc.filename}' is due in {days_remaining} days on {date_str}. Review your checklist immediately!\"")
                except ValueError:
                    # Skip invalid date formats
                    continue

        if active_alerts_sent == 0:
            print("Scheduler Status: Scan complete. No milestones are within the 3-day alert threshold.")
        else:
            print(f"\nScheduler Status: Scan complete. Dispatched {active_alerts_sent} mock notifications.")

    except Exception as e:
        print(f"Scheduler error occurred: {str(e)}")
    finally:
        session.close()
        print("----------------------------------------------------------------------")

if __name__ == '__main__':
    # Run the alerts check directly
    run_scheduler_alert_checks()
