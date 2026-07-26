# NyayaMitra AI – AI Legal Accessibility Platform

**Understand Before You Act.**

NyayaMitra AI is an AI-powered legal accessibility platform built to simplify complex legal documents for ordinary citizens. It translates legalese into simple language, extracts critical deadlines, retrieves relevant laws via Retrieval-Augmented Generation (RAG), and provides English/Telugu translation along with audio readouts.

---

## 📂 Project Directory Structure

```
nyayamitra-ai/
├── backend/                  # FastAPI Backend Server
│   ├── data/                 # Local legal database JSON
│   ├── routers/              # API Route controllers (upload, chat, translation)
│   ├── services/             # Core logic (Gemini API client, RAG indexer, TTS/Calendar)
│   ├── tests/                # Automated pytest cases
│   ├── main.py               # Application entry point
│   ├── config.py             # Environment configurations
│   ├── schemas.py            # Pydantic schemas (JSON Validation)
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React Single Page App (Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # UI widgets (UploadZone, Timeline, Checklist, Chat)
│   │   ├── App.tsx           # Global state & panel router
│   │   ├── index.css         # Styling system & theme colors
│   │   └── main.tsx          # React mounting entry point
│   ├── index.html            # Core entry layout
│   ├── package.json          # Node dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite execution configuration
│
└── README.md                 # Project Setup & Guide
```

---

## ⚡ Quick Start Guide

### Backend Setup
1. Navigate to `/backend`
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your Gemini API Key:
   ```bash
   # Windows PowerShell
   $env:GEMINI_API_KEY="your-gemini-api-key"
   ```
4. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to `/frontend`
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
