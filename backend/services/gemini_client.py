import os
import base64
import httpx
import logging
import google.generativeai as genai
from config import GEMINI_API_KEY, OPENROUTER_API_KEY, OPENROUTER_MODEL

logger = logging.getLogger(__name__)

# Configure standard Gemini if key is present
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def analyze_notice_document(file_bytes: bytes, mime_type: str, prompt: str) -> str:
    """
    Sends raw document bytes (PDF or Image) to the LLM backend (either OpenRouter or direct Gemini API)
    for multimodal extraction and returns the structured JSON output response.
    """
    
    # A. Use OpenRouter Gateway if OPENROUTER_API_KEY is present
    if OPENROUTER_API_KEY:
        logger.info(f"OpenRouter Gateway Active. Sending payload to model: {OPENROUTER_MODEL}")
        base64_str = base64.b64encode(file_bytes).decode("utf-8")
        file_data_url = f"data:{mime_type};base64,{base64_str}"

        # Setup messages content structure based on type
        is_pdf = "pdf" in mime_type.lower()
        if is_pdf:
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
        model = genai.GenerativeModel("gemini-1.5-flash")

        file_part = {
            "mime_type": mime_type,
            "data": file_bytes
        }

        generation_config = {
            "response_mime_type": "application/json"
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
        model = genai.GenerativeModel("gemini-1.5-flash")
        
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
