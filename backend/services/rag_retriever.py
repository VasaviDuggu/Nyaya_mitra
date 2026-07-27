import os
import json
import re
from typing import List, Dict, Any

# Resolve absolute path to laws_kb.json
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAWS_KB_PATH = os.path.join(BASE_DIR, "data", "laws_kb.json")

def load_laws_knowledge_base() -> List[Dict[str, Any]]:
    """Reads and parses the legal knowledge base JSON file."""
    if not os.path.exists(LAWS_KB_PATH):
        # Return fallback empty structure
        return []
    try:
        with open(LAWS_KB_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("laws", [])
    except Exception as e:
        print(f"Error loading legal database: {str(e)}")
        return []

def tokenize_text(text: str) -> set:
    """Cleans and tokenizes text, converting to lowercase and stripping punctuation."""
    text_lower = text.lower()
    # Replace non-alphanumeric characters with spaces
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', text_lower)
    # Split into words and filter short tokens
    tokens = {word for word in cleaned.split() if len(word) > 2}
    return tokens

def retrieve_matching_laws(document_text: str, limit: int = 2) -> List[Dict[str, Any]]:
    """
    Ranks the legal acts in laws_kb.json based on keyword overlap count with document_text.
    Returns the top 'limit' matching laws.
    """
    laws = load_laws_knowledge_base()
    if not laws:
        return []

    doc_tokens = tokenize_text(document_text)
    scored_laws = []

    for law in laws:
        # Match count of keywords overlapping with notice tokens
        keywords = [k.lower().strip() for k in law.get("keywords", [])]
        match_score = 0
        for kw in keywords:
            # Handle multi-word keyword phrases (e.g. "cheque bounce")
            if " " in kw:
                if kw in document_text.lower():
                    match_score += 3  # Higher weight for exact phrase matches
            elif kw in doc_tokens:
                match_score += 1

        if match_score > 0:
            scored_laws.append((match_score, law))

    # Sort descending by match score
    scored_laws.sort(key=lambda x: x[0], reverse=True)
    
    # Extract the top matching laws
    results = [law for _, law in scored_laws[:limit]]
    
    # If no overlaps found, return the top default law as a fallback
    if not results and laws:
        results = [laws[0]] # Section 106 as default fallback
        
    return results
