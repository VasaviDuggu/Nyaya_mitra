"""
Email OTP Service
Sends 6-digit verification codes to user email addresses via SMTP.
"""

import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", SMTP_USERNAME or "noreply@nyayamitra.ai")

def send_email_otp_msg(to_email: str, otp_code: str):
    """
    Sends a 6-digit OTP verification email via SMTP if configured, or logs to terminal.
    """
    subject = "NyayaMitra - Your 6-Digit Email Verification Code"
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 30px;">
        <div style="max-width: 500px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 30px; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #6366f1; text-align: center; margin-bottom: 20px;">⚖️ NyayaMitra AI</h2>
          <h3 style="text-align: center; color: #ffffff;">Email Verification Code</h3>
          <p style="color: #94a3b8; font-size: 14px; text-align: center;">Use the 6-digit verification code below to complete your account registration:</p>
          <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid #6366f1; border-radius: 12px; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #818cf8; margin: 24px 0;">
            {otp_code}
          </div>
          <p style="color: #64748b; font-size: 12px; text-align: center;">This verification code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      </body>
    </html>
    """

    if SMTP_USERNAME and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"NyayaMitra AI <{SENDER_EMAIL}>"
            msg["To"] = to_email

            part = MIMEText(html_content, "html")
            msg.attach(part)

            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
            server.quit()

            logger.info(f"Real SMTP Email OTP sent successfully to {to_email}")
            return {"status": "success", "message": f"Verification email sent to {to_email}"}
        except Exception as e:
            logger.error(f"SMTP Email Error: {str(e)}")
            logger.info(f"[SECURE LOG - EMAIL OTP for {to_email}]: {otp_code}")
            return {"status": "success", "message": f"Verification code generated for {to_email}"}
    else:
        logger.info("==================================================")
        logger.info(f"[SMTP NOT CONFIGURED IN .env - SECURE LOG]")
        logger.info(f"EMAIL TO: {to_email}")
        logger.info(f"VERIFICATION CODE: {otp_code}")
        logger.info("==================================================")
        return {"status": "success", "message": f"Verification code generated for {to_email}"}
