import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Gemini API Configurations
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# OpenRouter Configurations
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp")

# Local SQLite Database default configurations
DATABASE_URL = os.getenv("DATABASE_URL") # Will default to SQLite inside database.py if not specified
