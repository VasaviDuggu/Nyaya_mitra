"""
Twilio SMS Service
Handles sending SMS notifications and OTPs for NyayaMitra
"""

import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

ACCOUNT_SID = (os.getenv("TWILIO_ACCOUNT_SID") or "").strip()
AUTH_TOKEN = (os.getenv("TWILIO_AUTH_TOKEN") or "").strip()
TWILIO_PHONE_NUMBER = (os.getenv("TWILIO_PHONE_NUMBER") or "").strip()

def send_sms(to_number: str, message: str):
    """
    Send an SMS using Twilio with console logging fallback for development.
    """
    if ACCOUNT_SID and AUTH_TOKEN and TWILIO_PHONE_NUMBER:
        try:
            from twilio.rest import Client
            client = Client(ACCOUNT_SID, AUTH_TOKEN)
            sms = client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=to_number
            )
            logger.info(f"Twilio SMS sent to {to_number}: SID {sms.sid}")
            return {
                "status": "success",
                "sid": sms.sid,
                "message": "SMS sent successfully via Twilio"
            }
        except Exception as e:
            logger.error(f"Twilio SMS Error: {str(e)}")
            logger.info(f"[DEV FALLBACK SMS to {to_number}]: {message}")
            return {
                "status": "success",
                "message": f"Dev mode (Twilio notice): {str(e)} | Code: {message}"
            }
    else:
        logger.info(f"==================================================")
        logger.info(f"[DEV MODE - NO TWILIO CREDENTIALS SET IN .env]")
        logger.info(f"SMS TO: {to_number}")
        logger.info(f"MESSAGE: {message}")
        logger.info(f"==================================================")
        return {
            "status": "success",
            "message": "Dev mode: SMS logged to server terminal"
        }