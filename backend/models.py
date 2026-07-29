dirfrom sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone_number = Column(String(50), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    auth_provider = Column(String(50), default="email")  # "email" or "phone"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to uploaded documents
    documents = relationship("Document", back_populates="owner")

class OTPCode(Base):
    __tablename__ = "otp_codes"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(50), index=True, nullable=False)
    otp = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    doc_type = Column(String(100), nullable=True) # Eviction Notice, Summons, default notice, etc.
    file_path = Column(String(500), nullable=True)
    raw_text = Column(Text, nullable=False)
    
    # AI generated analysis components (stored as texts/JSON)
    summary_explanation = Column(Text, nullable=True)
    extracted_dates_json = Column(Text, nullable=True) # Stringified JSON array of date dicts
    legal_references_json = Column(Text, nullable=True) # Stringified JSON array of law citations
    checklist_json = Column(Text, nullable=True) # Stringified JSON array of next-step actions
    response_template = Column(Text, nullable=True) # Draft template response
    
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    owner = relationship("User", back_populates="documents")
    chat_logs = relationship("ChatLog", back_populates="document", cascade="all, delete-orphan")

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    role = Column(String(50), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to Document
    document = relationship("Document", back_populates="chat_logs")

class Law(Base):
    __tablename__ = "laws"

    id = Column(Integer, primary_key=True, index=True)
    act = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    scope = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    details = Column(Text, nullable=False)
    remedies_json = Column(Text, nullable=False) # JSON-serialized list
    keywords_json = Column(Text, nullable=False) # JSON-serialized list
