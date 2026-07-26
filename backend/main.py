from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="NyayaMitra AI API", version="1.0.0")

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
    history: List[ChatMessage] = []
    document_context: Optional[str] = None

class TranslateRequest(BaseModel):
    text: str
    target_language: str # e.g. 'telugu'

@app.get("/")
def read_root():
    return {"status": "running", "app": "NyayaMitra AI Backend"}

@app.post("/api/upload")
async def upload_document(
    file: UploadFile = File(...),
    notice_type: Optional[str] = Form(None)
):
    # Skeleton placeholder for document parsing and analysis
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File received. Skeleton pipeline active.",
        "analysis": {
            "summary": "This is a placeholder summary of the legal notice.",
            "document_type": "Tenant Eviction Notice",
            "extracted_dates": [
                {"title": "Response Deadline", "date": "2026-08-10", "urgency": "High"},
                {"title": "Hearing Date", "date": "2026-08-25", "urgency": "Medium"}
            ],
            "legal_references": [
                {"section": "Section 106 of the Transfer of Property Act", "description": "Mandates a 15-day notice period for lease terminations."}
            ],
            "checklist": [
                "Verify lease agreement signatures.",
                "Prepare rent payment bank statements.",
                "Consult a lawyer."
            ],
            "response_template": "Draft response to notice under Section 106..."
        }
    }

@app.post("/api/chat")
async def chat_interaction(request: ChatRequest):
    # Skeleton placeholder for contextual Q&A conversation
    user_query = request.message
    return {
        "reply": f"This is a placeholder reply to your question: '{user_query}'. Core RAG service will be connected in Day 2."
    }

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
