from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json

from sqlalchemy.orm import Session
from database import engine, get_db
import models

# Initialize SQLite database tables on server startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NyayaMitra AI API (Database-Backed)", version="1.0.0")

# Enable CORS for frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    document_id: int
    history: List[ChatMessage] = []

class TranslateRequest(BaseModel):
    text: str
    target_language: str # e.g. 'telugu'

@app.get("/")
def read_root():
    return {"status": "running", "app": "NyayaMitra AI Backend (SQLite Active)"}

@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    notice_type: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # 1. Read file contents
        content = await file.read()
        raw_text = content.decode("utf-8", errors="ignore")
        if not raw_text.strip():
            raw_text = f"Mock extracted notice text from uploaded file: {file.filename}"
        
        # 2. Mock analyzed outputs (Day 2 will replace this with Gemini multimodal parse)
        mock_summary = "This is a simplified summary of your eviction notice. Your landlord is claiming a rent default."
        mock_doc_type = notice_type if notice_type else "Tenant Lease Eviction Notice"
        mock_dates = [
            {"title": "Cure Period Deadline", "date": "2026-08-10", "urgency": "High"},
            {"title": "Summons Hearing Date", "date": "2026-08-25", "urgency": "Medium"}
        ]
        mock_references = [
            {"section": "Section 106 of the Transfer of Property Act, 1882", "description": "Mandates a 15-day prior written notice for month-to-month lease terminations."}
        ]
        mock_checklist = [
            "Check bank statements for rent payment proof.",
            "Draft a written response disputing the rent claim.",
            "Schedule a consultation with a local legal counselor."
        ]
        mock_template = "To: Property Management\nSubject: Eviction Notice Response\n\nI am writing in response to the notice dated July 26, 2026..."

        # 3. Create document record in SQLite Database
        db_doc = models.Document(
            filename=file.filename,
            doc_type=mock_doc_type,
            raw_text=raw_text,
            summary_explanation=mock_summary,
            extracted_dates_json=json.dumps(mock_dates),
            legal_references_json=json.dumps(mock_references),
            checklist_json=json.dumps(mock_checklist),
            response_template=mock_template
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)

        return {
            "document_id": db_doc.id,
            "filename": db_doc.filename,
            "doc_type": db_doc.doc_type,
            "uploaded_at": db_doc.uploaded_at,
            "analysis": {
                "summary": db_doc.summary_explanation,
                "extracted_dates": mock_dates,
                "legal_references": mock_references,
                "checklist": mock_checklist,
                "response_template": db_doc.response_template
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database upload write failed: {str(e)}")

@app.post("/api/chat")
async def chat_interaction(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        doc_id = request.document_id
        user_query = request.message

        # 1. Verify document exists in database
        doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Active document context not found in database.")

        # 2. Write User Message to Database logs
        user_log = models.ChatLog(document_id=doc_id, role="user", content=user_query)
        db.add(user_log)

        # 3. Generate Mock Reply (Day 3 will replace this with grounded Gemini Q&A)
        assistant_reply = f"Thank you for asking. Based on Section 106 and your eviction notice ({doc.filename}), here is a placeholder response to: '{user_query}'."
        
        # 4. Write Assistant Message to Database logs
        assistant_log = models.ChatLog(document_id=doc_id, role="assistant", content=assistant_reply)
        db.add(assistant_log)
        
        db.commit()

        return {
            "document_id": doc_id,
            "reply": assistant_reply
        }
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Chat database logging failed: {str(e)}")

@app.post("/api/translate")
async def translate_text(request: TranslateRequest):
    # Skeleton placeholder for Telugu translation
    text_to_translate = request.text
    lang = request.target_language
    return {
        "original_text": text_to_translate,
        "target_language": lang,
        "translated_text": f"[Placeholder Translation to {lang.upper()}] " + text_to_translate
    }

@app.get("/api/calendar")
async def generate_calendar_event(date: str, title: str):
    # Skeleton placeholder for generating .ics file downloads
    return {
        "message": f"Calendar event generation skeleton active for date {date} - title {title}"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
