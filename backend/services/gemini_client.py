import os
import google.generativeai as genai
from config import GEMINI_API_KEY

# Configure the Gemini API client
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.")

def analyze_notice_document(file_bytes: bytes, mime_type: str, prompt: str) -> str:
    """
    Sends raw document bytes (PDF or Image) to the Gemini API for multimodal extraction
    and returns the string response in structured JSON format.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is missing. Please set it in your environment variables.")

    # We use gemini-1.5-flash as the fast, multimodal model
    model = genai.GenerativeModel("gemini-1.5-flash")

    file_part = {
        "mime_type": mime_type,
        "data": file_bytes
    }

    # Configure generation to enforce JSON output format
    generation_config = {
        "response_mime_type": "application/json"
    }

    # Execute content generation
    response = model.generate_content(
        [file_part, prompt],
        generation_config=generation_config
    )
    return response.text
