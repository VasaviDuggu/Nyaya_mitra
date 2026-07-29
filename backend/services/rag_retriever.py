import os
import json
import re
from typing import List, Dict, Any
from database import SessionLocal
import models

def load_laws_from_db() -> List[Dict[str, Any]]:
    """Reads and parses the legal acts from the SQLite database."""
    db = SessionLocal()
    try:
        laws = db.query(models.Law).all()
        formatted_laws = []
        for l in laws:
            try:
                remedies = json.loads(l.remedies_json)
            except Exception:
                remedies = []
            try:
                keywords = json.loads(l.keywords_json)
            except Exception:
                keywords = []
            formatted_laws.append({
                "id": l.id,
                "act": l.act,
                "category": l.category,
                "scope": l.scope,
                "summary": l.summary,
                "details": l.details,
                "remedies": remedies,
                "keywords": keywords
            })
        return formatted_laws
    except Exception as e:
        print(f"Error loading legal database table: {str(e)}")
        return []
    finally:
        db.close()

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
    Ranks the legal acts in the SQLite database based on keyword overlap count with document_text.
    Returns the top 'limit' matching laws.
    """
    laws = load_laws_from_db()
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
