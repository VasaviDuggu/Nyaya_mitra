import sqlite3
import os
from database import SessionLocal, safe_commit
import models
from services.auth import hash_password, verify_password, create_access_token, verify_access_token, generate_otp
from services.twilio_service import send_sms

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "nyayamitra.db")

print("========== VERIFYING AUTHENTICATION & NYAYAMITRA.DB PERSISTENCE ==========")

db = SessionLocal()

try:
    # 1. Verify User Model and Password Hashing
    test_email = "testuser@nyayamitra.ai"
    test_name = "Hansh Verification User"
    test_pwd = "SecretPassword123"

    # Remove previous test user if exists
    existing = db.query(models.User).filter(models.User.email == test_email).first()
    if existing:
        db.delete(existing)
        safe_commit(db)

    hashed = hash_password(test_pwd)
    assert verify_password(test_pwd, hashed) == True, "Password hashing failed!"

    # Create user in DB
    user = models.User(
        full_name=test_name,
        email=test_email,
        password_hash=hashed,
        auth_provider="email"
    )
    db.add(user)
    safe_commit(db)

    db_user = db.query(models.User).filter(models.User.email == test_email).first()
    assert db_user is not None, "Failed to query created user!"

    print(f"✅ Email User created successfully in nyayamitra.db: ID={db_user.id}, Name={db_user.full_name}, Email={db_user.email}")

    # 2. Verify JWT Token Generation & Verification
    token = create_access_token({"sub": str(db_user.id), "email": db_user.email})
    payload = verify_access_token(token)
    assert payload is not None and int(payload["sub"]) == db_user.id, "JWT Token verification failed!"
    print("✅ JWT Token creation and decoding verified!")

    # 3. Verify Phone OTP Storage and Twilio Service
    test_phone = "+919876543210"
    otp = generate_otp()
    sms_res = send_sms(test_phone, f"Test OTP code is {otp}")
    assert sms_res["status"] == "success", "SMS service failed!"
    print(f"✅ Twilio SMS OTP dispatch verified (Result: {sms_res['message']})")

    # 4. Direct SQLite inspection on nyayamitra.db file
    conn = sqlite3.connect(DB_PATH, timeout=10)
    cursor = conn.cursor()
    cursor.execute("SELECT id, full_name, email, phone_number, auth_provider FROM users WHERE email=?", (test_email,))
    row = cursor.fetchone()
    assert row is not None, "User not found in SQLite file directly!"
    print(f"✅ Direct SQLite Inspection of nyayamitra.db: {row}")
    conn.close()

    print("\n🎉 ALL BACKEND AUTHENTICATION AND DATABASE TESTS PASSED SUCCESSFULLY!")

finally:
    db.close()
