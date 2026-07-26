from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(50), nullable=True)
    preferred_language = Column(String(50), default="english")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to uploaded documents
    documents = relationship("Document", back_populates="owner")

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
