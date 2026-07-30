from services.twilio_service import send_sms

response = send_sms(
    to_number="current_user.phone_number",
    message="🎉 Hello from Nyaya Mitra! Your Twilio integration is working."
)

print(response)