import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import Base, get_db

# Create a temporary test database file path
TEST_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "test_nyayamitra.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override the database dependency injection
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables and clean up file
    Base.metadata.drop_all(bind=engine)
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except Exception:
            pass

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()

def test_upload_notice():
    # Send a mock text file
    file_payload = ("test_notice.txt", b"This is a month to month lease eviction notice served to Mr. Hansh on June 1st. You must vacate the premises in 15 days.", "text/plain")
    response = client.post(
        "/api/upload",
        files={"file": file_payload},
        data={"notice_type": "Tenant Eviction"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "document_id" in data
    assert data["filename"] == "test_notice.txt"
    assert "analysis" in data
    assert "summary" in data["analysis"]
    assert "extracted_dates" in data["analysis"]

def test_chat_interaction():
    # Upload first to get a document_id
    file_payload = ("chat_test.txt", b"Cheque bounced notice. Settle bill in 15 days under section 138 of negotiable instruments.", "text/plain")
    up_res = client.post("/api/upload", files={"file": file_payload})
    doc_id = up_res.json()["document_id"]
    
    # Run chat query
    response = client.post(
        "/api/chat",
        json={
            "message": "When is my cheque settlement deadline?",
            "document_id": doc_id,
            "history": []
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == doc_id
    assert "reply" in data

def test_translate_text():
    response = client.post(
        "/api/translate",
        json={
            "text": "Eviction Notice served to Apartment 4B.",
            "target_language": "telugu"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "translated_text" in data
    assert "telugu" in data["target_language"].lower()

def test_calendar_exporter():
    response = client.get("/api/calendar?date=2026-08-10&title=Eviction+Deadline")
    assert response.status_code == 200
    assert "message" in response.json()
