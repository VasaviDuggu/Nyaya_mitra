# ⚖️ NyayaMitra AI – Citizen Legal Shield & Accessibility Platform

> **Understand Before You Act.**
> NyayaMitra AI is an AI-powered legal accessibility platform built to simplify complex legal notices for ordinary citizens. It translates dense legalese into simple language, extracts critical deadlines, retrieves relevant statutory laws using a lightweight database, provides dual-language support (English & Telugu), generates audio readouts, and drafts custom response statements that can be edited and downloaded as PDFs.

---

## 🚀 Key Features

*   **📂 Multimodal Document Ingestion**: Supports PDF, PNG, and JPEG uploads of legal notices up to 10MB.
*   **📑 Multi-Tab Citizen Analysis Workspace**:
    *   **Summary**: Provides simplified, plain-language explanations of the notice's claims and implications.
    *   **Laws & References**: Displays relevant section codes and descriptions mapping directly to the notice's context.
    *   **Checklist**: Interactive procedural checklist items for citizens to take action.
    *   **Response Draft**: An editable response draft template editor with:
        *   **Expand/Compress Mode**: absolute fullscreen canvas for spacious writing.
        *   **PDF Exporter**: opens a styled legal letterhead format and triggers native Print-to-PDF downloads.
        *   **One-click Clipboard Copy**: copies the drafted notice with toast alerts.
    *   **Nyaya Chat**: Context-aware AI chatbot assistant to answer notice-specific questions.
*   **🗓️ Milestone Tracking & Reminders**: Automatically parses legal deadlines and downloads `.ics` files to add reminders directly to Google, Outlook, or Apple calendars.
*   **🔊 TTS Audio Readouts**: High-quality voice synthesizers for audio playback of summaries.
*   **🌐 Bilingual Support**: Seamless translations between English and Telugu.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v18), Vite, TypeScript, Lucide React, Vanilla CSS with custom CSS variables (supporting vibrant dark/light modes).
*   **Backend**: FastAPI (Python 3.8+), SQLAlchemy, SQLite database, PyPDF, and Uvicorn.
*   **AI Gateway**: Direct Google Gemini API (`gemini-flash-latest`) or OpenRouter API (`google/gemini-2.5-flash`) for low-latency OCR & document processing.

---

## 📂 Project Directory Structure

```
nyayamitra-ai/
├── backend/                  # FastAPI Backend Server
│   ├── data/                 # SQLite Database & seed assets
│   │   └── nyayamitra.db     # Active SQLite database file
│   ├── routers/              # API Route controllers (upload, chat, calendar)
│   ├── services/             # Core logic (Gemini/OpenRouter client, RAG indexer, TTS)
│   ├── tests/                # Automated pytest cases
│   ├── main.py               # Application entry point
│   ├── config.py             # Environment configurations
│   ├── database.py           # SQLAlchemy configurations
│   ├── models.py             # Database models
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React Single Page App (Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx           # Global state, tabs layout & panels router
│   │   ├── index.css         # Responsive styling system & theme variables
│   │   └── main.tsx          # React mounting entry point
│   ├── index.html            # Core entry layout
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configurations
│   └── vite.config.ts        # Vite build configurations
│
└── README.md                 # Project Setup & Guide
```

---

## ⚡ Quick Start Guide

### 1. Repository Setup
Clone the repository and pull the latest changes:
```bash
git clone https://github.com/hanshikavelaga/Nyaya_mitra.git
cd Nyaya_mitra
```

### 2. Backend Setup
1. Create a virtual environment and activate it:
   ```bash
   cd backend
   python -m venv venv
   
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1
   # macOS/Linux:
   source venv/bin/activate
   ```
2. Install python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Create your local environment configuration file:
   Create a file named `.env` in the `backend/` directory:
   ```env
   # Local configurations
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=google/gemini-2.5-flash
   ```
4. Run the development server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:3000`** to view the app!

---

## 📡 API Endpoints Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/upload` | POST | Ingests notices, performs RAG querying, and returns structured JSON analysis. |
| `/api/chat` | POST | Context-aware chat completions based on notice data. |
| `/api/laws` | GET | Fetches full statutory laws listing from the local database. |
| `/api/calendar` | GET | Generates standard `.ics` calendar invitation file. |

---

## ⚖️ Disclaimer
NyayaMitra AI is an AI tool designed to assist citizens in understanding public legal notices. It is **not** a replacement for professional legal representation. Always consult a qualified advocate or attorney before submitting formal legal responses.
