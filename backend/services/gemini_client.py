import os
import io
import base64
import httpx
import logging
import pypdf
import google.generativeai as genai
from config import GEMINI_API_KEY, OPENROUTER_API_KEY, OPENROUTER_MODEL

logger = logging.getLogger(__name__)

# Configure standard Gemini if key is present
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts plain text from raw PDF bytes locally using pypdf to avoid sending
    file payloads over network aggregators.
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = pypdf.PdfReader(pdf_file)
        text_list = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text_list.append(t)
        return "\n".join(text_list)
    except Exception as e:
        logger.error(f"Local PDF text extraction failed: {str(e)}")
        return ""

def analyze_notice_document(file_bytes: bytes, mime_type: str, prompt: str) -> str:
    """
    Sends raw document bytes (PDF or Image) to the LLM backend (either OpenRouter or direct Gemini API)
    for multimodal extraction and returns the structured JSON output response.
    """
    
    # A. Use OpenRouter Gateway if OPENROUTER_API_KEY is present
    if OPENROUTER_API_KEY:
        logger.info(f"OpenRouter Gateway Active. Sending payload to model: {OPENROUTER_MODEL}")
        is_pdf = "pdf" in mime_type.lower()
        is_text = "text" in mime_type.lower()
        
        if is_text:
            text_str = file_bytes.decode("utf-8")
            logger.info("Spoken or plain text notice description received. Sending as standard text query.")
            full_prompt = f"{prompt}\n\nSPOKEN OR PLAIN TEXT NOTICE:\n{text_str}"
            message_content = [
                {"type": "text", "text": full_prompt}
            ]
        elif is_pdf:
            local_text = extract_text_from_pdf_bytes(file_bytes)
            if local_text.strip():
                logger.info("PDF text extracted locally. Sending as standard text query to bypass OpenRouter $0.50 file restrictions.")
                full_prompt = f"{prompt}\n\nDOCUMENT RAW TEXT EXTRACTED LOCALLY:\n{local_text}"
                message_content = [
                    {"type": "text", "text": full_prompt}
                ]
            else:
                logger.warning("Local PDF extraction returned empty. Falling back to base64 PDF upload.")
                base64_str = base64.b64encode(file_bytes).decode("utf-8")
                file_data_url = f"data:{mime_type};base64,{base64_str}"
                message_content = [
                    {"type": "text", "text": prompt},
                    {
                        "type": "file",
                        "file": {
                            "filename": "notice_document.pdf",
                            "file_data": file_data_url
                        }
                    }
                ]
        else:
            # Handle images as standard image_url base64 blocks (exempt from $0.50 file policy)
            base64_str = base64.b64encode(file_bytes).decode("utf-8")
            file_data_url = f"data:{mime_type};base64,{base64_str}"
            message_content = [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": file_data_url
                    }
                }
            ]

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://github.com/hanshikavelaga/Nyaya_mitra",
            "X-Title": "NyayaMitra AI",
            "Content-Type": "application/json"
        }

        # Set max_tokens to bypass low credit token limitations (affording under 14k tokens)
        payload = {
            "model": OPENROUTER_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": message_content
                }
            ],
            "response_format": {"type": "json_object"},
            "max_tokens": 4000
        }

        try:
            with httpx.Client(timeout=60.0) as client:
                response = client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                )
                if response.status_code != 200:
                    logger.error(f"OpenRouter API error code {response.status_code}: {response.text}")
                    raise ValueError(f"OpenRouter API returned error code {response.status_code}: {response.text}")
                
                res_data = response.json()
                reply_text = res_data["choices"][0]["message"]["content"]
                return reply_text
        except Exception as e:
            logger.error(f"OpenRouter request failure: {str(e)}")
            raise e

    # B. Default fallback to direct Google Gemini API if key is present
    elif GEMINI_API_KEY:
        logger.info("Direct Gemini API Active. Sending payload via generativeai SDK.")
        model = genai.GenerativeModel("gemini-flash-latest")
        is_text = "text" in mime_type.lower()

        generation_config = {
            "response_mime_type": "application/json"
        }

        if is_text:
            text_str = file_bytes.decode("utf-8")
            response = model.generate_content(
                f"{prompt}\n\nSPOKEN OR PLAIN TEXT NOTICE:\n{text_str}",
                generation_config=generation_config
            )
        else:
            file_part = {
                "mime_type": mime_type,
                "data": file_bytes
            }
            response = model.generate_content(
                [file_part, prompt],
                generation_config=generation_config
            )
        return response.text

    else:
        raise ValueError("No LLM API keys configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY in backend/.env")

def generate_text_completion(system_prompt: str, user_prompt: str, history_messages: list = None) -> str:
    """
    Handles standard text-only chat completions using either OpenRouter or direct Gemini API.
    """
    # A. Use OpenRouter Gateway
    if OPENROUTER_API_KEY:
        messages = [{"role": "system", "content": system_prompt}]
        
        # Format conversation history
        if history_messages:
            for msg in history_messages:
                messages.append({
                    "role": "user" if msg.get("role") == "user" else "assistant",
                    "content": msg.get("content", "")
                })
        
        messages.append({"role": "user", "content": user_prompt})

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://github.com/hanshikavelaga/Nyaya_mitra",
            "X-Title": "NyayaMitra AI",
            "Content-Type": "application/json"
        }

        # Include max_tokens limit of 1500 to prevent balance exhaustion errors
        payload = {
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "max_tokens": 1500
        }

        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                )
                if response.status_code == 200:
                    res_data = response.json()
                    return res_data["choices"][0]["message"]["content"]
                else:
                    raise ValueError(f"OpenRouter text completion failed: {response.text}")
        except Exception as e:
            logger.error(f"OpenRouter text completion error: {str(e)}")
            raise e

    # B. Use direct Gemini API
    elif GEMINI_API_KEY:
        model = genai.GenerativeModel("gemini-flash-latest")
        
        # Build prompt incorporating system context and history
        chat_prompt = f"{system_prompt}\n\n"
        if history_messages:
            for msg in history_messages:
                role_label = "USER" if msg.get("role") == "user" else "ASSISTANT"
                chat_prompt += f"{role_label}: {msg.get('content', '')}\n"
        chat_prompt += f"USER: {user_prompt}\nASSISTANT:"

        response = model.generate_content(chat_prompt)
        return response.text

    else:
        raise ValueError("No LLM API keys configured.")
