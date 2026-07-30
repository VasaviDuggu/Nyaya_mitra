from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import logging

try:
    from email_validator import validate_email, EmailNotValidError
except ImportError:
    validate_email = None
    EmailNotValidError = Exception

from database import get_db, safe_commit
import models
from services.auth import hash_password, verify_password, create_access_token, verify_access_token, generate_otp
from services.twilio_service import send_sms
from services.email_service import send_email_otp_msg

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# =========================
# Request Schemas
# =========================

class EmailSignUpRequest(BaseModel):
    full_name: str
    email: str
    password: str

class SendEmailOTPRequest(BaseModel):
    email: str

class VerifyEmailOTPRequest(BaseModel):
    email: str
    otp: str
    full_name: str
    password: str

class EmailLoginRequest(BaseModel):
    email: str
    password: str

class SendOTPRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str
    full_name: Optional[str] = None

# =========================
# Helper Functions
# =========================

def validate_email_address_real(email: str):
    """
    Validates email format and domain MX deliverability using email-validator library.
    """
    clean_email = email.strip().lower()
    if not clean_email or "@" not in clean_email:
        raise HTTPException(status_code=400, detail="Invalid email format. Please enter a valid email address.")

    if validate_email:
        try:
            valid_info = validate_email(clean_email, check_deliverability=True)
            return valid_info.normalized
        except EmailNotValidError as e:
            raise HTTPException(status_code=400, detail=f"Email deliverability check failed: {str(e)}")
    return clean_email

# =========================
# Auth Endpoints
# =========================

@router.post("/send-email-otp")
def send_email_otp(req: SendEmailOTPRequest, db: Session = Depends(get_db)):
    clean_email = validate_email_address_real(req.email)

    try:
        existing_user = db.query(models.User).filter(models.User.email == clean_email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="An account with this email address already exists. Please sign in.")

        otp_code = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        db_otp = models.EmailOTPCode(
            email=clean_email,
            otp=otp_code,
            expires_at=expires_at
        )
        db.add(db_otp)
        safe_commit(db)

        # Dispatch real email message
        email_res = send_email_otp_msg(clean_email, otp_code)

        return {
            "status": "success",
            "message": f"6-digit verification code sent to {clean_email}"
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Send Email OTP error: {e}")
        raise HTTPException(status_code=500, detail=f"Email OTP error: {str(e)}")

@router.post("/verify-email-otp")
def verify_email_otp(req: VerifyEmailOTPRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    otp_input = req.otp.strip()
    clean_name = req.full_name.strip()

    if not clean_name:
        raise HTTPException(status_code=400, detail="Full name is required.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    try:
        now = datetime.utcnow()
        valid_otp = db.query(models.EmailOTPCode).filter(
            models.EmailOTPCode.email == clean_email,
            models.EmailOTPCode.otp == otp_input,
            models.EmailOTPCode.expires_at >= now
        ).order_by(models.EmailOTPCode.id.desc()).first()

        if not valid_otp:
            raise HTTPException(status_code=400, detail="Invalid or expired 6-digit Email OTP code. Please check your email inbox.")

        existing_user = db.query(models.User).filter(models.User.email == clean_email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Account already exists. Please sign in.")

        hashed_pwd = hash_password(req.password)
        user = models.User(
            full_name=clean_name,
            email=clean_email,
            password_hash=hashed_pwd,
            auth_provider="email"
        )
        db.add(user)
        safe_commit(db)

        created_user = db.query(models.User).filter(models.User.email == clean_email).first()
        token = create_access_token({"sub": str(created_user.id), "email": created_user.email})

        return {
            "status": "success",
            "token": token,
            "user": {
                "id": created_user.id,
                "full_name": created_user.full_name,
                "email": created_user.email,
                "phone_number": created_user.phone_number,
                "auth_provider": created_user.auth_provider
            }
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Verify Email OTP error: {e}")
        raise HTTPException(status_code=500, detail=f"Verify Email OTP error: {str(e)}")

@router.post("/signup")
def signup_with_email(req: EmailSignUpRequest, db: Session = Depends(get_db)):
    clean_email = validate_email_address_real(req.email)
    clean_name = req.full_name.strip()

    if not clean_name:
        raise HTTPException(status_code=400, detail="Full name is required.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    try:
        existing_user = db.query(models.User).filter(models.User.email == clean_email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="An account with this email address already exists. Please sign in.")

        hashed_pwd = hash_password(req.password)
        user = models.User(
            full_name=clean_name,
            email=clean_email,
            password_hash=hashed_pwd,
            auth_provider="email"
        )
        db.add(user)
        safe_commit(db)

        created_user = db.query(models.User).filter(models.User.email == clean_email).first()

        token = create_access_token({"sub": str(created_user.id), "email": created_user.email})
        return {
            "status": "success",
            "token": token,
            "user": {
                "id": created_user.id,
                "full_name": created_user.full_name,
                "email": created_user.email,
                "phone_number": created_user.phone_number,
                "auth_provider": created_user.auth_provider
            }
        }
    except HTTPException:
        db.rollback()
        raise
    except OperationalError as oe:
        db.rollback()
        logger.error(f"Database Lock Error during signup: {oe}")
        raise HTTPException(
            status_code=503,
            detail="SQLite database is locked by DB Browser for SQLite. Please write-commit or close DB Browser."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Signup exception: {e}")
        raise HTTPException(status_code=500, detail=f"Signup error: {str(e)}")

@router.post("/login")
def login_with_email(req: EmailLoginRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    try:
        user = db.query(models.User).filter(models.User.email == clean_email).first()
        
        if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password. Please check your credentials.")

        token = create_access_token({"sub": str(user.id), "email": user.email})
        return {
            "status": "success",
            "token": token,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "auth_provider": user.auth_provider
            }
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Login exception: {e}")
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

@router.post("/send-otp")
def send_phone_otp(req: SendOTPRequest, db: Session = Depends(get_db)):
    phone = req.phone_number.strip()
    if not phone or len(phone) < 8:
        raise HTTPException(status_code=400, detail="Please enter a valid phone number with country code.")

    try:
        otp_code = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        db_otp = models.OTPCode(
            phone_number=phone,
            otp=otp_code,
            expires_at=expires_at
        )
        db.add(db_otp)
        safe_commit(db)

        # Send Twilio SMS to user phone
        sms_res = send_sms(phone, f"Your NyayaMitra OTP code is {otp_code}. Valid for 10 minutes.")

        existing_user = db.query(models.User).filter(models.User.phone_number == phone).first()
        is_registered = existing_user is not None and bool(existing_user.full_name)

        return {
            "status": "success",
            "message": f"6-digit SMS OTP code sent to {phone}",
            "is_registered": is_registered
        }
    except HTTPException:
        db.rollback()
        raise
    except OperationalError as oe:
        db.rollback()
        logger.error(f"Database Lock Error during send-otp: {oe}")
        raise HTTPException(
            status_code=503,
            detail="SQLite database is locked by DB Browser for SQLite. Please write-commit or close DB Browser."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Send OTP error: {e}")
        raise HTTPException(status_code=500, detail=f"Send OTP error: {str(e)}")

@router.post("/verify-otp")
def verify_phone_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    phone = req.phone_number.strip()
    otp_input = req.otp.strip()

    try:
        now = datetime.utcnow()
        valid_otp = db.query(models.OTPCode).filter(
            models.OTPCode.phone_number == phone,
            models.OTPCode.otp == otp_input,
            models.OTPCode.expires_at >= now
        ).order_by(models.OTPCode.id.desc()).first()

        if not valid_otp:
            raise HTTPException(status_code=400, detail="Invalid or expired SMS OTP code. Please check your mobile phone SMS.")

        user = db.query(models.User).filter(models.User.phone_number == phone).first()

        if not user:
            if not req.full_name or not req.full_name.strip():
                return {
                    "status": "requires_name",
                    "message": "First time signing up with this phone number. Please enter your full name."
                }
            user = models.User(
                full_name=req.full_name.strip(),
                phone_number=phone,
                auth_provider="phone"
            )
            db.add(user)
            safe_commit(db)
        else:
            if req.full_name and req.full_name.strip() and not user.full_name:
                user.full_name = req.full_name.strip()
                safe_commit(db)

        db_user = db.query(models.User).filter(models.User.phone_number == phone).first()
        if not db_user:
            raise HTTPException(
                status_code=503,
                detail="SQLite database file is locked by DB Browser for SQLite. Please close DB Browser and try again."
            )

        token = create_access_token({"sub": str(db_user.id), "phone_number": db_user.phone_number})
        return {
            "status": "success",
            "token": token,
            "user": {
                "id": db_user.id,
                "full_name": db_user.full_name,
                "email": db_user.email,
                "phone_number": db_user.phone_number,
                "auth_provider": db_user.auth_provider
            }
        }
    except HTTPException:
        db.rollback()
        raise
    except OperationalError as oe:
        db.rollback()
        logger.error(f"Database Lock Error during verify-otp: {oe}")
        raise HTTPException(
            status_code=503,
            detail="SQLite database is locked by DB Browser. Please write-commit or close DB Browser."
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Verify OTP error: {e}")
        raise HTTPException(status_code=500, detail=f"Verify OTP error: {str(e)}")

@router.get("/me")
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required.")

    token = authorization.split(" ")[1]
    payload = verify_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    user_id = int(payload["sub"])
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        user_docs = db.query(models.Document).filter(models.Document.user_id == user.id).all()
        docs_data = []
        for doc in user_docs:
            docs_data.append({
                "id": doc.id,
                "filename": doc.filename,
                "doc_type": doc.doc_type,
                "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
                "summary": doc.summary_explanation,
                "extracted_dates": doc.extracted_dates_json,
                "legal_references": doc.legal_references_json,
                "checklist": doc.checklist_json,
                "response_template": doc.response_template
            })

        return {
            "status": "success",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "phone_number": user.phone_number,
                "auth_provider": user.auth_provider
            },
            "documents": docs_data
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")