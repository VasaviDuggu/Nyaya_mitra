import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import OperationalError

# Get the absolute path of the backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# Create data directory if it doesn't exist
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# SQLite Database path
DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'nyayamitra.db')}"

# Create SQLite engine with 30s timeout
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False, "timeout": 30}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for models
Base = declarative_base()

# Database Dependency Injection Hook
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

def safe_commit(db, retries=5):
    """
    Commit transaction safely. Retries if database is temporarily locked by external applications like DB Browser.
    """
    last_error = None
    for attempt in range(retries):
        try:
            db.commit()
            return
        except Exception as e:
            last_error = e
            db.rollback()
            if "locked" in str(e).lower() and attempt < retries - 1:
                time.sleep(1.0)
            else:
                raise e
    if last_error:
        raise last_error
