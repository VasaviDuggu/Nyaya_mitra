import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Gemini API Configurations
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Local SQLite Database default configurations
DATABASE_URL = os.getenv("DATABASE_URL") # Will default to SQLite inside database.py if not specified
