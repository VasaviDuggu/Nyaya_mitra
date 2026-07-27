from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json
import logging
import google.generativeai as genai

from sqlalchemy.orm import Session
from database import engine, get_db
import models

# Import API Routers
from routers.upload import router as upload_router
from services.rag_retriever import retrieve_matching_laws
from config import GEMINI_API_KEY

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

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

        # 3. Retrieve matched laws dynamically based on active question + document context (RAG)
        search_query = f"{doc.filename} {doc.raw_text} {user_query}"
        matched_laws = retrieve_matching_laws(search_query)
        laws_context_str = json.dumps(matched_laws, indent=2)

        # 4. Generate grounded reply (Gemini or Mock Fallback)
        disclaimer = "\n\n---\n*Disclaimer: NyayaMitra provides simplified legal translations based on matched public statutes. This is not formal legal advice. Please consult an advocate before filing appeals.*"
        
        if not GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set. Loading matched mock RAG response.")
            # Local smart fallback using matched RAG laws
            matched_law_name = matched_laws[0].get("act") if matched_laws else "General Civil Code"
            matched_law_summary = matched_laws[0].get("summary") if matched_laws else "Verify notices in writing."
            
            assistant_reply = (
                f"Based on your document '{doc.filename}' and matched legal guidelines: **{matched_law_name}**,\n"
                f"here is a helpful response to your query '{user_query}':\n\n"
                f"* Statute: {matched_law_summary}\n"
                f"* Recommendation: Check if your notice lists these parameters and reply within the given deadline.\n"
                f"Let me know if you would like me to draft a dispute letter for you!"
                f"{disclaimer}"
            )
        else:
            # Build history string
            history_lines = []
            for msg in request.history:
                history_lines.append(f"{msg.role.upper()}: {msg.content}")
            history_str = "\n".join(history_lines)

            # RAG prompt structure
            chat_prompt = f"""
You are NyayaMitra AI, a citizen-friendly legal translation assistant.
You are helping a citizen understand a legal notice they uploaded.
Provide a simple, clear, and reassuring reply to their question.

DOCUMENT CONTEXT:
Filename: {doc.filename}
Classified Category: {doc.doc_type}
Raw text: {doc.raw_text}

GROUNDING LAWS CONTEXT (RAG):
{laws_context_str}

CONVERSATION HISTORY:
{history_str}

USER QUERY:
"{user_query}"

Instructions:
1. Settle their queries clearly, avoiding complex legalese.
2. Ground your facts solely in the provided document context and matched laws. Do not make up external legal proceedings.
3. Keep it brief (under 150 words).
"""
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(chat_prompt)
            assistant_reply = response.text + disclaimer
        
        # 5. Write Assistant Message to Database logs
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
    text_to_translate = request.text
    lang = request.target_language.lower()
    
    if not GEMINI_API_KEY:
        # Static English-to-Telugu translation dictionary for demo fallback
        telugu_dictionary = {
            "1. Document Ingestion": "1. పత్రం అప్‌లోడ్",
            "2. AI Analysis Workspace": "2. ఏఐ విశ్లేషణ విభాగం",
            "Drag & drop your notice file here": "మీ నోటీసు పత్రాన్ని ఇక్కడ డ్రాప్ చేయండి",
            "Supports PDF, PNG, JPEG up to 10MB": "PDF, PNG, JPEG ఫార్మాట్లు (గరిష్టంగా 10MB)",
            "Browse File": "ఫైల్ ఎంచుకోండి",
            "Analyzing legal document...": "పత్రాన్ని విశ్లేషిస్తోంది...",
            "Extracting text with Gemini AI": "జెమిని ఏఐ ద్వారా సమాచారాన్ని సేకరిస్తోంది",
            "Remove": "తొలగించు",
            "Notice File Detail Preview": "పత్రం పాఠ్య వివరణ ప్రివ్యూ",
            "Listen Summary": "సారాంశం వినండి",
            "Pause Audio": "ఆడియో నిలిపివేయండి",
            "Plain Language Explanation": "సాధారణ భాషా వివరణ",
            "Critical Milestones Timeline": "కీలక గడువుల కాలక్రమం",
            "Relevant Legal Citations": "సంబంధిత చట్టపరమైన ఆధారాలు",
            "Recommended Next Steps": "సిఫార్సు చేయబడిన తదుపరి చర్యలు",
            "Autogenerated Response Template": "స్వయంచాలక ప్రత్యుత్తర నమూనా",
            "Your landlord, Greenwood Management, claims you default on July rent of INR 25,000.": "మీ యజమాని గ్రీన్‌వుడ్ మేనేజ్‌మెంట్ మీరు రూ. 25,000 అద్దె చెల్లించలేదని నోటీసు పంపారు.",
            "Verify receipts.": "రశీదులను సరిచూసుకోండి.",
            "Draft legal dispute reply.": "ప్రత్యుత్తర లేఖను సిద్ధం చేయండి."
        }
        
        # Search dictionary or append translation tag
        translated = telugu_dictionary.get(text_to_translate, f"[తెలుగు అనువాదం] {text_to_translate}")
    else:
        try:
            # Call Gemini to translate cleanly
            model = genai.GenerativeModel("gemini-1.5-flash")
            translation_prompt = f"Translate the following legal notice text into clear, citizen-friendly Telugu. Preserve spacing, punctuation, names, and key numbers. Only output the translated text:\n\n{text_to_translate}"
            response = model.generate_content(translation_prompt)
            translated = response.text
        except Exception:
            translated = f"[తెలుగు అనువాదం] {text_to_translate}"
            
    return {
        "original_text": text_to_translate,
        "target_language": lang,
        "translated_text": translated
    }

@app.get("/api/calendar")
async def generate_calendar_event(date: str, title: str):
    # Generates a basic ICS calendar string
    ics_content = (
        "BEGIN:VCALENDAR\n"
        "VERSION:2.0\n"
        "PRODID:-//NyayaMitra//Milestone Calendar//EN\n"
        f"BEGIN:VEVENT\n"
        f"SUMMARY:{title}\n"
        f"DTSTART;VALUE=DATE:{date.replace('-', '')}\n"
        f"DTEND;VALUE=DATE:{date.replace('-', '')}\n"
        "DESCRIPTION:NyayaMitra AI Legal Notice Deadline Reminder.\n"
        "END:VEVENT\n"
        "END:VCALENDAR\n"
    )
    return {
        "message": f"Calendar event file generated for {title}",
        "ics_file_content": ics_content
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
