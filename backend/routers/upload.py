from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
import json
import logging
from typing import Optional

from database import get_db
import models
from services.gemini_client import analyze_notice_document
from config import GEMINI_API_KEY

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Document Ingestion"])

PROMPT_TEMPLATE = """
You are a legal document parsing assistant for ordinary citizens.
Analyze this legal notice (e.g. eviction warning, court summons, default notice, lease dispute).
Extract the core details and compile them into a simplified plain-language structure.

You must output a single JSON object matching this exact schema:
{
  "raw_text": "verbatim OCR transcription text of the original document, preserving line breaks, names, dates and key legal citations",
  "summary": "A clean, simplified summary of what the notice is about, written for a 10th-grade reading level. Do not use complex legalese.",
  "document_type": "The classified category of the legal document (e.g., Landlord Tenant Notice, Court Summons, Bank Loan Default Notice).",
  "extracted_dates": [
    {
      "title": "Short title of the milestone (e.g., Response Due Date, Court Hearing Date)",
      "date": "YYYY-MM-DD format string",
      "urgency": "High (deadlines under 7 days or court summons), Medium (deadlines between 7-30 days), or Low (informational dates)"
    }
  ],
  "legal_references": [
    {
      "section": "The specific legal code, section, or act cited (e.g., Section 106 of the Transfer of Property Act, 1882)",
      "description": "A citizen-friendly explanation of what this legal section actually means in the context of their notice."
    }
  ],
  "checklist": [
    "A clean, step-by-step checklist of actions the citizen should take immediately to respond or defend themselves."
  ],
  "response_template": "A formal, polite, legally-structured response draft answering the notice. Leave placeholders like [Your Name] or [Insert Proof ID] where appropriate."
}
"""

@router.post("/upload")
async def upload_and_analyze_document(
    file: UploadFile = File(...),
    notice_type: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # 1. Read uploaded file bytes
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # Determine MIME type (default fallback)
        mime_type = file.content_type
        if not mime_type:
            mime_type = "application/pdf" if file.filename.endswith(".pdf") else "image/png"

        # Determine default raw text preview from decode (fallback only)
        raw_text_preview = ""
        if mime_type.startswith("text/") or file.filename.endswith(".txt"):
            try:
                raw_text_preview = content.decode("utf-8")
            except Exception:
                raw_text_preview = "[Binary notice file content]"
        else:
            raw_text_preview = f"[Multimodal PDF/Image Notice Binary File: {file.filename}]"

        # 3. Call Gemini Multimodal API or load mock fallback if key is missing
        if not GEMINI_API_KEY:
            logger.warning("GEMINI_API_KEY not set. Loading mock analysis data for local testing.")
            # Local mock fallback
            analysis_data = {
                "raw_text": (
                    "EVICTION NOTICE\n\n"
                    "TO: Mr. Hansh, Apartment 4B, Greenwood Residencies, Hyderabad.\n"
                    "DATE: July 26, 2026\n\n"
                    "You are hereby notified that you are in default of your lease agreement dated June 1, 2024. "
                    "Specifically, you have failed to pay the rent due for July 2026 in the amount of INR 25,000.\n\n"
                    "Pursuant to Section 106 of the Transfer of Property Act, you are required to cure this default "
                    "or vacate the premises within fifteen (15) days from the receipt of this notice, failing which "
                    "legal proceedings will be initiated against you.\n\n"
                    "SENDER: Greenwood Property Management Ltd."
                ),
                "summary": "Your landlord, Greenwood Management, claims you default on July rent of INR 25,000.",
                "document_type": notice_type if notice_type else "Tenant Lease Notice",
                "extracted_dates": [
                    {"title": "Eviction Notice Deadline", "date": "2026-08-10", "urgency": "High"},
                    {"title": "Summons Hearing Date", "date": "2026-08-25", "urgency": "Medium"}
                ],
                "legal_references": [
                    {"section": "Section 106 of the Transfer of Property Act, 1882", "description": "Requires a minimum 15-day prior written notice for lease terminations."}
                ],
                "checklist": [
                    "Locate rent payment receipts.",
                    "Draft an eviction dispute reply letter.",
                    "Register to attend court hearing."
                ],
                "response_template": "To: Greenwood Management\nSubject: Eviction Notice Response\n\nI am writing in response to the notice..."
            }
        else:
            # Execute actual Gemini multimodal OCR & analysis call
            logger.info(f"Sending file {file.filename} ({mime_type}) to Gemini API...")
            gemini_response = analyze_notice_document(content, mime_type, PROMPT_TEMPLATE)
            logger.info("Successfully received response from Gemini API.")
            
            # Parse the JSON output returned from Gemini
            analysis_data = json.loads(gemini_response)

        # 4. Save analysis results to the SQLite Database
        db_doc = models.Document(
            filename=file.filename,
            doc_type=analysis_data.get("document_type", "Unknown Notice"),
            raw_text=analysis_data.get("raw_text", raw_text_preview),
            summary_explanation=analysis_data.get("summary", ""),
            extracted_dates_json=json.dumps(analysis_data.get("extracted_dates", [])),
            legal_references_json=json.dumps(analysis_data.get("legal_references", [])),
            checklist_json=json.dumps(analysis_data.get("checklist", [])),
            response_template=analysis_data.get("response_template", "")
        )
        
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)

        # 5. Return structured result payload
        return {
            "document_id": db_doc.id,
            "filename": db_doc.filename,
            "doc_type": db_doc.doc_type,
            "raw_text": db_doc.raw_text,
            "uploaded_at": db_doc.uploaded_at,
            "analysis": {
                "summary": db_doc.summary_explanation,
                "extracted_dates": analysis_data.get("extracted_dates", []),
                "legal_references": analysis_data.get("legal_references", []),
                "checklist": analysis_data.get("checklist", []),
                "response_template": db_doc.response_template
            }
        }

    except json.JSONDecodeError as je:
        logger.error(f"Failed to parse Gemini JSON output: {str(je)}")
        raise HTTPException(status_code=502, detail="AI engine did not return valid JSON. Please try again.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to upload document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document upload processing failed: {str(e)}")
