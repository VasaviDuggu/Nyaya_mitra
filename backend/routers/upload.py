from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
import json
import logging
from typing import Optional

from database import get_db
import models
from services.gemini_client import analyze_notice_document
from services.rag_retriever import retrieve_matching_laws
from config import GEMINI_API_KEY, OPENROUTER_API_KEY

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

        # 2. Retrieve matched laws from the local database (RAG Grounding)
        matched_laws = retrieve_matching_laws(file.filename + " " + raw_text_preview)
        matched_laws_json = json.dumps(matched_laws, indent=2)

        # 3. Call LLM API (OpenRouter or direct Gemini) or load mock fallback if keys are missing
        if not GEMINI_API_KEY and not OPENROUTER_API_KEY:
            logger.warning("No API keys set. Loading dynamic mock analysis data based on filename.")
            
            fn_lower = file.filename.lower()
            
            # A. Court Summons Case Match
            if "summons" in fn_lower or "court" in fn_lower:
                mock_dates = [
                    {"title": "Court Hearing Date", "date": "2026-09-05", "urgency": "High"},
                    {"title": "Written Reply Filing Deadline", "date": "2026-08-20", "urgency": "Medium"}
                ]
                mock_citations = [
                    {
                        "section": "Section 19 of the Recovery of Debts and Bankruptcy Act, 1993",
                        "description": "Provides formal rules for debt recovery applications in the Debts Recovery Tribunal (DRT). Citizens get 30 days to file written defenses."
                    }
                ]
                mock_checklist = [
                    "Draft and file a formal Written Reply Statement within 30 days.",
                    "Verify the bank statement interest rates and calculation disputes.",
                    "Engage a legal representative to appear on the hearing date: 2026-09-05."
                ]
                analysis_data = {
                    "raw_text": (
                        "IN THE DEBTS RECOVERY TRIBUNAL (DRT), HYDERABAD\n"
                        "SUMMONS UNDER SECTION 19 OF THE ACT\n\n"
                        "OA NO. 402 OF 2026\n"
                        "BETWEEN: State Financial Bank Ltd (Applicant)\n"
                        "AND: Mr. Hansh, Hyderabad (Defendant)\n\n"
                        "WHEREAS the applicant bank has filed an application for the recovery of INR 10,50,000. "
                        "You are hereby summoned to file a reply within 30 days and appear before this Tribunal."
                    ),
                    "summary": "You have received a formal court summons from the Debts Recovery Tribunal (DRT) regarding a bank recovery lawsuit of INR 10,50,000.",
                    "document_type": "Debts Recovery Tribunal Summons",
                    "extracted_dates": mock_dates,
                    "legal_references": mock_citations,
                    "checklist": mock_checklist,
                    "response_template": "BEFORE THE HON'BLE DEBTS RECOVERY TRIBUNAL\nReply Statement filed by the Defendant..."
                }
            
            # B. Cheque Bounce Case Match
            elif "cheque" in fn_lower or "bounce" in fn_lower:
                mock_dates = [
                    {"title": "Pay Outstanding Dues", "date": "2026-08-11", "urgency": "High"},
                    {"title": "Complaint Filing Window Opens", "date": "2026-08-26", "urgency": "Medium"}
                ]
                mock_citations = [
                    {
                        "section": "Section 138 of the Negotiable Instruments Act, 1881",
                        "description": "Criminal offense for cheque dishonor due to insufficient funds. The drawer gets a 15-day notice period to pay the bounced amount."
                    }
                ]
                mock_checklist = [
                    "Settle the outstanding cheque sum of INR 50,000 within 15 days to avoid criminal charges.",
                    "Collect bank bounce memos and return receipts.",
                    "Draft a reply letter disputing the debt if the cheque was signed for security only."
                ]
                analysis_data = {
                    "raw_text": (
                        "ADVOCATE DEMAND NOTICE UNDER SECTION 138\n"
                        "DATE: July 27, 2026\n\n"
                        "TO: Mr. Hansh, Hyderabad.\n"
                        "RE: Dishonor of Cheque No: 004125 for INR 50,000\n\n"
                        "Under instructions from my client, I hereby call upon you to make the payment "
                        "of the bounced cheque amount of INR 50,000 within fifteen (15) days of receiving this notice."
                    ),
                    "summary": "You have been served a criminal legal notice regarding a bounced cheque of INR 50,000 due to insufficient account balance.",
                    "document_type": "Cheque Bounce Notice",
                    "extracted_dates": mock_dates,
                    "legal_references": mock_citations,
                    "checklist": mock_checklist,
                    "response_template": "To, Advocate [Name]\nIn reply to your notice regarding Cheque No: 004125..."
                }

            # C. Electricity Disconnection Match
            elif "electricity" in fn_lower or "power" in fn_lower or "bill" in fn_lower:
                mock_dates = [
                    {"title": "Power Disconnection Deadline", "date": "2026-08-12", "urgency": "High"}
                ]
                mock_citations = [
                    {
                        "section": "Section 56 of the Electricity Act, 2003",
                        "description": "Mandates that power supply cannot be cut off unless a clear 15-day written warning notice is served to the consumer."
                    }
                ]
                mock_checklist = [
                    "Check if 15 clear days notice was given in writing before power cutoff.",
                    "Pay the undisputed base bill amount to avoid immediate service cuts.",
                    "File an appeal with the consumer grievance forum (CGRF) if bill readings are faulty."
                ]
                analysis_data = {
                    "raw_text": (
                        "SOUTHERN POWER DISTRIBUTION COMPANY (TSSPDCL)\n"
                        "DISCONNECTION WARNING NOTICE\n\n"
                        "CONSUMER ID: 5041289\n"
                        "Outstanding bill arrears: INR 12,400\n\n"
                        "You are hereby notified that your electricity connection will be disconnected "
                        "if the outstanding dues are not cleared within 15 days."
                    ),
                    "summary": "Your power utility provider has threatened disconnection of service due to outstanding unpaid power bill arrears of INR 12,400.",
                    "document_type": "Electricity Disconnection Warning",
                    "extracted_dates": mock_dates,
                    "legal_references": mock_citations,
                    "checklist": mock_checklist,
                    "response_template": "To the Assistant Engineer,\nTSSPDCL Office..."
                }

            # D. Default Landlord Tenant Eviction Notice Fallback
            else:
                mock_dates = [
                    {"title": "Eviction Notice Deadline", "date": "2026-08-10", "urgency": "High"},
                    {"title": "Notice Cure Period Close", "date": "2026-08-25", "urgency": "Medium"}
                ]
                mock_citations = []
                mock_checklist = []
                for law in matched_laws:
                    mock_citations.append({
                        "section": law.get("act", "General Legal Guidance"),
                        "description": law.get("summary", "Verify service requirements.")
                    })
                    for remedy in law.get("remedies", []):
                        mock_checklist.append(remedy)
                
                if not mock_checklist:
                    mock_checklist = ["Locate original agreement.", "Draft formal dispute response."]
                    
                analysis_data = {
                    "raw_text": (
                        f"EVICTION NOTICE\n\n"
                        f"TO: Mr. Hansh, Apartment 4B, Greenwood Residencies, Hyderabad.\n"
                        f"DATE: July 26, 2026\n\n"
                        f"You are hereby notified that you are in default of your lease agreement. "
                        f"Specifically, you have failed to pay the rent due for July 2026 in the amount of INR 25,000.\n\n"
                        f"Pursuant to the matched legal acts, you are required to cure this default "
                        f"or vacate the premises within fifteen (15) days from the receipt of this notice.\n\n"
                        f"SENDER: Greenwood Property Management Ltd."
                    ),
                    "summary": f"Your landlord, Greenwood Management, claims you defaulted on July rent of INR 25,000. Matched Law: {matched_laws[0].get('act') if matched_laws else 'General Landlord/Tenant Laws'}",
                    "document_type": notice_type if notice_type else "Tenant Lease Notice",
                    "extracted_dates": mock_dates,
                    "legal_references": mock_citations,
                    "checklist": mock_checklist,
                    "response_template": "To: Greenwood Management\nSubject: Eviction Notice Response\n\nI am writing in response to the notice..."
                }
        else:
            # Build RAG-grounded prompt template
            rag_prompt = f"""
{PROMPT_TEMPLATE}

GROUNDING LEGAL CITATIONS (RAG CONTEXT):
The following laws are matched from our database as highly relevant to this document.
You MUST ground your legal references, plain description, and recommended checklist steps in these exact acts where applicable.
{matched_laws_json}
"""
            # Execute actual Gemini multimodal OCR & analysis call (which routes to OpenRouter or Gemini!)
            logger.info("Sending file to LLM analyze_notice_document service...")
            gemini_response = analyze_notice_document(content, mime_type, rag_prompt)
            logger.info("Successfully received response from LLM service.")
            
            # Parse the JSON output returned
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
        logger.error(f"Failed to parse LLM JSON output: {str(je)}")
        raise HTTPException(status_code=502, detail="AI engine did not return valid JSON. Please try again.")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to upload document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document upload processing failed: {str(e)}")
