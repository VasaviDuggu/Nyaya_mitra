from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from sqlalchemy.orm import Session
from database import engine, get_db
import models

# Import API Routers
from routers.upload import router as upload_router

# Initialize SQLite database tables on server startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NyayaMitra AI API", version="1.0.0")

# Enable CORS for frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upload_router)

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
