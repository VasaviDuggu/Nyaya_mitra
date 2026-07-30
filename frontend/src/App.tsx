import React, { useState, useRef, useEffect } from 'react'

// Interactive SVG Icon Components
const DashboardIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const LibraryIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
  </svg>
);

const ScheduleIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ChatIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MenuIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ScaleIcon = ({ size = 32, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="7" x2="21" y2="7" />
    <path d="M6 7c0 4.5 2 8 6 8s6-3.5 6-8" />
    <path d="M4 21h16" />
  </svg>
);

const BoltIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const VolumeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const PauseIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const CopyIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const FileIcon = ({ size = 32, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const LockIcon = ({ size = 36, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const SunIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const UserIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TrashIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const FolderIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const UploadIcon = ({ size = 36, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const MaximizeIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const MinimizeIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="10" y1="14" x2="3" y2="21" />
  </svg>
);

const getCategoryIcon = (cat: string, color: string) => {
  const normCat = cat.toLowerCase();
  if (normCat.includes('tenancy') || normCat.includes('housing')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (normCat.includes('finance') || normCat.includes('bank')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <line x1="6" y1="12" x2="6" y2="12.01" />
        <line x1="18" y1="12" x2="18" y2="12.01" />
      </svg>
    );
  }
  if (normCat.includes('consumer') || normCat.includes('right')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (normCat.includes('utilit') || normCat.includes('service')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (normCat.includes('civil') || normCat.includes('personal') || normCat.includes('cyber')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }
  if (normCat.includes('land')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (normCat.includes('family')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (normCat.includes('employ')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  if (normCat.includes('inherit') || normCat.includes('heir')) {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
};

interface Milestone {
  title: string;
  date: string;
  urgency: string;
}

interface LegalReference {
  section: string;
  description: string;
}

interface AnalysisData {
  summary: string;
  extracted_dates: Milestone[];
  legal_references: LegalReference[];
  checklist: string[];
  response_template: string;
}

interface UploadResponse {
  document_id: number;
  filename: string;
  doc_type: string;
  raw_text?: string;
  uploaded_at: string;
  analysis: AnalysisData;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  english: {
    ingestionTitle: "1. Document Ingestion Portal",
    workspaceTitle: "2. AI Analysis Workspace",
    dragDropText: "Drag & drop your notice file here",
    supportText: "Supports PDF, PNG, JPEG up to 10MB",
    browseBtn: "Browse Local File",
    analyzingText: "Analyzing legal document...",
    extractingText: "Extracting notice structures with Gemini AI",
    removeBtn: "Remove File",
    previewTitle: "Notice File Detail Preview",
    listenBtn: "Listen Summary",
    pauseBtn: "Pause Audio",
    plainExTitle: "Plain Language Explanation",
    milestoneTitle: "Critical Milestones Timeline",
    legalCitations: "Relevant Legal Citations",
    checklistTitle: "Recommended Next Steps",
    responseDraftTitle: "Autogenerated Response Template",
    chatGreeting: "Hello! How can I help you understand this notice today?",
    chatPlaceholder: "Type a follow-up question...",
    sendBtn: "Send Query",
    thinkingText: "Thinking... ⌛",
    daysRemaining: "Days Remaining",
    passedText: "Passed",
    todayText: "Today",
    urgencyText: "Urgency Level",
    warningText: "This document contains high-urgency deadlines. Please review the timeline and checklists immediately.",
    downloadCal: "Sync Calendar (.ics)",
    copyBtn: "Copy Draft",
    copiedToast: "Response Template Copied!"
  },
  telugu: {
    ingestionTitle: "1. పత్రం అప్‌లోడ్ పోర్టల్",
    workspaceTitle: "2. ఏఐ విశ్లేషణ విభాగం",
    dragDropText: "మీ నోటీసు పత్రాన్ని ఇక్కడ డ్రాప్ చేయండి",
    supportText: "PDF, PNG, JPEG ఫార్మాట్లు (గరిష్టంగా 10MB)",
    browseBtn: "ఫైల్ ఎంచుకోండి",
    analyzingText: "పత్రాన్ని విశ్లేషిస్తోంది...",
    extractingText: "జెమిని ఏఐ ద్వారా సమాచారాన్ని సేకరిస్తోంది",
    removeBtn: "తొలగించు",
    previewTitle: "పత్రం పాఠ్య వివరణ ప్రివ్యూ",
    listenBtn: "సారాంశం వినండి",
    pauseBtn: "ఆడియో నిలిపివేయండి",
    plainExTitle: "సాధారణ భాషా వివరణ",
    milestoneTitle: "కీలక గడువుల కాలక్రమం",
    legalCitations: "సంబంధిత చట్టపరమైన ఆధారాలు",
    checklistTitle: "సిఫార్సు చేయబడిన తదుపరి చర్యలు",
    responseDraftTitle: "స్వయంచాలక ప్రత్యుత్తర నమూనా",
    chatGreeting: "నమస్కారం! ఈ నోటీసుకు సంబంధించి మీకు ఎలాంటి సహాయం కావాలి?",
    chatPlaceholder: "తదుపరి ప్రశ్న అడగండి...",
    sendBtn: "పంపించు",
    thinkingText: "ఆలోచిస్తోంది... ⌛",
    daysRemaining: "రోజులు మిగిలి ఉన్నాయి",
    passedText: "గడువు ముగిసింది",
    todayText: "ఈరోజు",
    urgencyText: "అత్యవసర స్థాయి",
    warningText: "ఈ పత్రంలో అత్యవసర గడువులు ఉన్నాయి. దయచేసి గడువు తేదీలు మరియు చర్యలను వెంటనే పరిశీలించండి.",
    downloadCal: "క్యాలెండర్ గుర్తు (.ics)",
    copyBtn: "కాపీ చేయండి",
    copiedToast: "ప్రత్యుత్తర నమూనా కాపీ చేయబడింది!"
  }
};

export default function App() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [language, setLanguage] = useState('english');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard'); 
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open for premium look
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Laws Library dynamic states
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lawsList, setLawsList] = useState<any[]>([]);
  const [expandedLawId, setExpandedLawId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settings profile states (persisted locally to prevent database conflicts)
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('nyayamitra_user_name') || 'Hanshika Velaga');
  const [userEmail, setUserEmail] = useState<string>(() => localStorage.getItem('nyayamitra_user_email') || 'hansh@nyayamitra.ai');
  const [userPhone, setUserPhone] = useState<string>(() => localStorage.getItem('nyayamitra_user_phone') || '+91 98765 43210');

  // Fetch unique categories on load
  useEffect(() => {
    fetch('/api/laws/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(['All', ...data]);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Fetch filtered laws on selectedCategory change
  useEffect(() => {
    const url = selectedCategory === 'All' ? '/api/laws' : `/api/laws?category=${encodeURIComponent(selectedCategory)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLawsList(data);
        }
      })
      .catch(err => console.error("Error fetching laws:", err));
  }, [selectedCategory]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCalendar, setPendingCalendar] = useState<{date: string, title: string} | null>(null);
  const [toastText, setToastText] = useState('Copied to clipboard!');

  // Full-stack states
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [translatedAnalysis, setTranslatedAnalysis] = useState<AnalysisData | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Copy success toast state
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Chat interface states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Template editor states
  const [editedTemplate, setEditedTemplate] = useState<string>('');
  const [isTemplateExpanded, setIsTemplateExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const t = (key: string) => {
    return UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS['english'][key] || key;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTab]);

  useEffect(() => {
    if (language === 'telugu' && analysis) {
      triggerTranslation();
    } else {
      setTranslatedAnalysis(null);
    }
  }, [language, analysis]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Sync editedTemplate state when new analysis data loads or language switches
  useEffect(() => {
    if (analysis) {
      if (language === 'telugu' && translatedAnalysis) {
        setEditedTemplate(translatedAnalysis.response_template || '');
      } else {
        setEditedTemplate(analysis.response_template || '');
      }
    } else {
      setEditedTemplate('');
    }
  }, [analysis, translatedAnalysis, language]);

  const handleVoiceToggle = () => {
    const summaryText = displayAnalysis?.summary;
    if (!summaryText) return;

    if (isPlayingVoice) {
      window.speechSynthesis.pause();
      setIsPlayingVoice(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlayingVoice(true);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(summaryText);
        utteranceRef.current = utterance;
        
        const voices = window.speechSynthesis.getVoices();
        if (language === 'telugu') {
          const telVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('IN'));
          if (telVoice) utterance.voice = telVoice;
          utterance.lang = 'te-IN';
        } else {
          const engVoice = voices.find(v => v.lang.includes('en'));
          if (engVoice) utterance.voice = engVoice;
          utterance.lang = 'en-US';
        }

        utterance.onend = () => setIsPlayingVoice(false);
        utterance.onerror = () => setIsPlayingVoice(false);

        window.speechSynthesis.speak(utterance);
        setIsPlayingVoice(true);
      }
    }
  };

  const triggerTranslation = async () => {
    if (!analysis) return;
    try {
      const summaryRes = await translateText(analysis.summary, 'telugu');
      const translatedMilestones = await Promise.all(
        analysis.extracted_dates.map(async (m) => ({
          ...m,
          title: await translateText(m.title, 'telugu')
        }))
      );
      const translatedLaws = await Promise.all(
        analysis.legal_references.map(async (l) => ({
          section: l.section,
          description: await translateText(l.description, 'telugu')
        }))
      );
      const translatedChecklist = await Promise.all(
        analysis.checklist.map(async (step) => await translateText(step, 'telugu'))
      );
      const translatedTemplate = await translateText(analysis.response_template, 'telugu');

      setTranslatedAnalysis({
        summary: summaryRes,
        extracted_dates: translatedMilestones,
        legal_references: translatedLaws,
        checklist: translatedChecklist,
        response_template: translatedTemplate
      });
    } catch (err) {
      console.error("Translation error:", err);
      setTranslatedAnalysis(null);
    }
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_language: targetLang })
      });
      const data = await response.json();
      return data.translated_text;
    } catch {
      return `[తెలుగు] ${text}`;
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    await uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data: UploadResponse = await response.json();
      setDocumentId(data.document_id);
      setDocType(data.doc_type);
      setRawText(data.raw_text || '');
      setAnalysis(data.analysis);
      setChatMessages([{ role: 'assistant', content: t('chatGreeting') }]);
      setFileUploaded(true);
    } catch (err: any) {
      setError(err.message || "Failed to process document.");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !documentId || isSendingChat) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          document_id: documentId,
          history: chatMessages
        })
      });

      if (!response.ok) {
        throw new Error("Chat failed.");
      }

      const data = await response.json();
      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCalendarDownload = async (dateStr: string, titleStr: string) => {
    if (!isLoggedIn) {
      setPendingCalendar({ date: dateStr, title: titleStr });
      setShowLoginModal(true);
      return;
    }
    try {
      const url = `/api/calendar?date=${dateStr}&title=${encodeURIComponent(titleStr)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.ics_file_content) {
        const element = document.createElement("a");
        const file = new Blob([data.ics_file_content], { type: 'text/calendar' });
        element.href = URL.createObjectURL(file);
        element.download = `${titleStr.toLowerCase().replace(/ /g, '_')}_reminder.ics`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastText(language === 'english' ? 'Copied to clipboard!' : 'క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!');
    setShowCopyToast(true);
    setTimeout(() => {
      setShowCopyToast(false);
    }, 2500);
  };

  const handleDownloadPDF = (text: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>NyayaMitra AI - Draft Response Letter</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333333;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .letter-header {
              text-align: center;
              border-bottom: 2px solid #6366f1;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .letter-title {
              font-size: 20px;
              font-weight: bold;
              color: #1e1b4b;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .letter-meta {
              font-size: 12px;
              color: #666666;
              margin-top: 5px;
            }
            .letter-content {
              white-space: pre-wrap;
              font-size: 14px;
              color: #333333;
            }
            .letter-footer {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 11px;
              color: #888888;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="letter-header">
            <h1 class="letter-title">DISPUTE RESPONSE STATEMENT</h1>
            <div class="letter-meta">Generated via NyayaMitra AI | Case Reference: #${documentId || 'N/A'}</div>
          </div>
          <div class="letter-content">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          <div class="letter-footer">
            Disclaimer: This is an AI-generated draft response based on public statutes. It is not formal legal advice. Please review with an advocate before formal filing.
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    setFile(null);
    setFileUploaded(false);
    setDocumentId(null);
    setRawText('');
    setAnalysis(null);
    setTranslatedAnalysis(null);
    setDocType('');
    setError(null);
    setActiveTab('summary');
    setIsPlayingVoice(false);
    setChatMessages([]);
    setEditedTemplate('');
    setIsTemplateExpanded(false);
  };

  const getRemainingDays = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      await uploadFile(droppedFile);
    }
  };

  const filteredLaws = lawsList.filter(law => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    
    const actMatch = law.act?.toLowerCase().includes(query);
    const scopeMatch = law.scope?.toLowerCase().includes(query);
    const summaryMatch = law.summary?.toLowerCase().includes(query);
    const detailsMatch = law.details?.toLowerCase().includes(query);
    const keywordMatch = law.keywords?.some((kw: string) => kw.toLowerCase().includes(query));
    
    return actMatch || scopeMatch || summaryMatch || detailsMatch || keywordMatch;
  });

  const displayAnalysis = language === 'telugu' && translatedAnalysis ? translatedAnalysis : analysis;

  return (
    <div className={isDarkMode ? "" : "light-theme"} style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* Toast Alert Notification */}
      {showCopyToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: 'var(--color-success)',
          color: '#ffffff',
          padding: '14px 28px',
          borderRadius: '12px',
          fontWeight: '800',
          fontSize: '13px',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'var(--font-header)'
        }}>
          ✨ {toastText}
        </div>
      )}

      {/* 1. Left Collapsible Navigation Sidebar */}
      <aside style={{ 
        width: sidebarOpen ? '280px' : '88px', 
        background: 'rgba(8, 12, 24, 0.8)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 0',
        transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 100,
        boxShadow: '8px 0 32px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(30px)'
      }}>
        {/* Toggle Hamburger Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'var(--color-text-primary)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '14px',
            marginBottom: '40px',
            width: '48px',
            height: '48px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            outline: 'none',
            transition: 'all 0.3s'
          }}
          className="logo-pulse"
        >
          <MenuIcon color="var(--color-text-primary)" size={20} />
        </button>

        {sidebarOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px', textAlign: 'center', padding: '0 20px', animation: 'fadeIn 0.3s' }}>
            <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px', filter: 'drop-shadow(0 4px 10px rgba(99, 102, 241, 0.2))' }}>
              <ScaleIcon color="var(--color-accent-indigo)" size={48} />
            </span>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-header)' }}>
              NyayaMitra AI
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '9px', color: 'var(--color-accent-gold)', letterSpacing: '3px', fontWeight: '800', fontFamily: 'var(--font-header)' }}>
              CITIZEN LEGAL SHIELD
            </p>
          </div>
        )}

        {/* Navigation links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', padding: '0 16px', boxSizing: 'border-box' }}>
          {[
            { id: 'dashboard', label: language === 'english' ? 'Dashboard Portal' : 'డాష్‌బోర్డ్ పోర్టల్', icon: <DashboardIcon color={activeNav === 'dashboard' ? '#ffffff' : 'var(--color-text-secondary)'} /> },
            { id: 'library', label: language === 'english' ? 'Laws Database' : 'చట్టాల గ్రంథాలయం', icon: <LibraryIcon color={activeNav === 'library' ? '#ffffff' : 'var(--color-text-secondary)'} /> },
            { id: 'schedule', label: language === 'english' ? 'Milestone Track' : 'గడువుల పట్టిక', icon: <ScheduleIcon color={activeNav === 'schedule' ? '#ffffff' : 'var(--color-text-secondary)'} /> },
            { id: 'settings', label: language === 'english' ? 'Settings & Profile' : 'సెట్టింగులు & ప్రొఫైల్', icon: <SettingsIcon color={activeNav === 'settings' ? '#ffffff' : 'var(--color-text-secondary)'} /> }
          ].map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={isActive ? "nav-btn-active" : ""}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  background: 'none',
                  border: '1px solid transparent',
                  borderRadius: '16px',
                  color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none',
                  fontFamily: 'var(--font-header)',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </aside>

      {/* 2. Main Portal Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Top Header bar */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '24px 56px',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(8, 12, 24, 0.4)',
          backdropFilter: 'blur(20px)'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-header)' }}>
              {activeNav === 'dashboard' ? (language === 'english' ? 'Citizen Analysis Dashboard' : 'సిటిజన్ విశ్లేషణ డాష్‌బోర్డ్') : activeNav === 'library' ? (language === 'english' ? 'Laws & Regulation library' : 'చట్టాలు & నిబంధనల గ్రంథాలయం') : (language === 'english' ? 'Active Notice Schedules' : 'సక్రియ నోటీసు షెడ్యూల్‌లు')}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {/* Language switch */}
            <div style={{ 
              display: 'flex', 
              background: 'rgba(255,255,255,0.02)', 
              padding: '4px', 
              borderRadius: '30px', 
              border: '1px solid var(--color-border)' 
            }}>
              <button 
                onClick={() => setLanguage('english')}
                style={{
                  background: language === 'english' ? 'var(--color-accent-indigo)' : 'none',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  fontSize: '11px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-header)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                ENGLISH
              </button>
              <button 
                onClick={() => setLanguage('telugu')}
                style={{
                  background: language === 'telugu' ? 'var(--color-accent-indigo)' : 'none',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  fontSize: '11px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-header)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                తెలుగు
              </button>
            </div>

            {/* Dark/Light Theme Switch Button */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--color-border)',
                borderRadius: '30px',
                padding: '8px 18px',
                color: 'var(--color-text-primary)',
                fontSize: '11px',
                fontWeight: '800',
                fontFamily: 'var(--font-header)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{isDarkMode ? <SunIcon color="var(--color-accent-gold)" /> : <MoonIcon color="var(--color-accent-indigo)" />}</span>
              <span>{isDarkMode ? (language === 'english' ? 'LIGHT' : 'లైట్') : (language === 'english' ? 'DARK' : 'డార్క్')}</span>
            </button>

            {/* User Profile Login/Logout Button */}
            <button 
              onClick={() => {
                if (isLoggedIn) {
                  setIsLoggedIn(false);
                } else {
                  setShowLoginModal(true);
                }
              }}
              style={{
                background: isLoggedIn ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isLoggedIn ? 'var(--color-success)' : 'var(--color-border)'}`,
                borderRadius: '30px',
                padding: '8px 18px',
                color: isLoggedIn ? 'var(--color-success)' : 'var(--color-text-primary)',
                fontSize: '11px',
                fontWeight: '800',
                fontFamily: 'var(--font-header)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}><UserIcon color={isLoggedIn ? 'var(--color-success)' : 'var(--color-text-primary)'} /></span>
              <span>
                {isLoggedIn 
                  ? (language === 'english' ? 'LOGOUT' : 'లాగ్ అవుట్') 
                  : (language === 'english' ? 'SIGN IN' : 'లాగిన్')}
              </span>
            </button>
          </div>
        </header>

        {/* 3. Render Navigation Views */}
        {activeNav === 'dashboard' ? (
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 56px', gap: '28px', overflowY: 'auto', position: 'relative' }}>
            
            {/* Upper Grid: Ingestion and AI Workspace Side-by-Side */}
            <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
              
              {/* Left Column: Document Ingestion */}
              <section className="glass-card" style={{ flex: 1, minWidth: '400px', padding: '32px', display: 'flex', flexDirection: 'column', height: '640px', overflow: 'hidden' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '800', letterSpacing: '-0.01em', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}><FolderIcon color="var(--color-accent-indigo)" /></span> {t('ingestionTitle')}
              </h2>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
              />

              {!fileUploaded ? (
                <div 
                  style={{ 
                    flex: 1, 
                    border: '2px dashed rgba(99, 102, 241, 0.25)', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: '36px',
                    cursor: 'pointer',
                    background: isUploading ? 'rgba(255,255,255,0.01)' : 'rgba(99, 102, 241, 0.01)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: 'inset 0 0 40px rgba(99,102,241,0.02)'
                  }} 
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent-indigo)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)'}
                >
                  {isUploading ? (
                    <>
                      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '100%', border: '3px solid rgba(99, 102, 241, 0.1)', borderTopColor: 'var(--color-accent-indigo)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <BoltIcon size={32} color="var(--color-accent-indigo)" />
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '800', color: '#ffffff', fontSize: '15px' }}>{t('analyzingText')}</p>
                      <p style={{ margin: '0 0 24px 0', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>{t('extractingText')}</p>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', boxShadow: '0 8px 24px rgba(99,102,241,0.1)' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}><UploadIcon color="var(--color-accent-indigo)" size={36} /></span>
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '800', color: '#ffffff', fontSize: '15.5px' }}>{t('dragDropText')}</p>
                      <p style={{ margin: '0 0 32px 0', fontSize: '12.5px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{t('supportText')}</p>
                      <button className="glow-btn">{t('browseBtn')}</button>
                      {error && <p style={{ margin: '20px 0 0 0', color: 'var(--color-danger)', fontSize: '13px', fontWeight: '800' }}>❌ {error}</p>}
                    </>
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                  
                  {/* File status metadata card */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '20px', 
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '16px',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}><FileIcon color="var(--color-accent-indigo)" size={32} /></span>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#ffffff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {file?.name || "uploaded_notice.pdf"}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                          {(file ? (file.size / 1024 / 1024).toFixed(1) : "1.2")} MB | {docType} | Database ID: #{documentId}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleReset}
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.08)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)', 
                        padding: '6px 14px', 
                        borderRadius: '12px', 
                        color: 'var(--color-danger)', 
                        cursor: 'pointer', 
                        fontSize: '12px', 
                        fontWeight: '800', 
                        transition: 'all 0.2s', 
                        outline: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                    >
                      <TrashIcon color="var(--color-danger)" size={14} />
                      {t('removeBtn')}
                    </button>
                  </div>

                  {/* OCR text display container */}
                  <div style={{ 
                    flex: 1, 
                    background: '#040711', 
                    color: '#e2e8f0', 
                    borderRadius: '16px', 
                    padding: '24px', 
                    fontSize: '13px', 
                    lineHeight: '1.7', 
                    overflowY: 'auto',
                    border: '1px solid var(--color-border)',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent-gold)', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        UTF-8 Raw OCR Output
                      </span>
                      <h3 style={{ margin: 0, fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>
                        {t('previewTitle')}
                      </h3>
                    </div>
                    <p style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'Fira Code, Consolas, Monaco, monospace', 
                      fontSize: '11px', 
                      background: 'rgba(0,0,0,0.4)', 
                      padding: '20px', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      wordBreak: 'break-all',
                      overflowWrap: 'break-word',
                      margin: 0,
                      color: '#6ee7b7',
                      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                    }}>
                      {rawText || "Reading document bytes..."}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Right Column: AI Analysis Workspace */}
            <section className="glass-card" style={{ flex: 1.3, minWidth: '450px', padding: '32px', display: 'flex', flexDirection: 'column', height: '640px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '-0.01em', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}><BoltIcon color="var(--color-accent-indigo)" /></span> {t('workspaceTitle')}
                </h2>
                
                {/* Visualizer tts synthesis button */}
                {fileUploaded && activeTab !== 'chat' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    
                    {/* Bouncing audio wave */}
                    {isPlayingVoice && (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
                        <div className="audio-wave-bar" />
                        <div className="audio-wave-bar" />
                        <div className="audio-wave-bar" />
                        <div className="audio-wave-bar" />
                      </div>
                    )}

                    <button 
                      onClick={handleVoiceToggle}
                      style={{
                        background: isPlayingVoice ? 'rgba(245, 158, 11, 0.15)' : 'rgba(120, 120, 120, 0.08)',
                        color: isPlayingVoice ? 'var(--color-accent-gold)' : 'var(--color-text-primary)',
                        border: isPlayingVoice ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--color-border)',
                        borderRadius: '30px',
                        padding: '8px 18px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontFamily: 'var(--font-header)'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>{isPlayingVoice ? <PauseIcon color="var(--color-accent-gold)" /> : <VolumeIcon color="var(--color-text-primary)" />}</span>
                      <span>{isPlayingVoice ? t('pauseBtn') : t('listenBtn')}</span>
                    </button>
                  </div>
                )}
              </div>

              {!fileUploaded ? (
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center'
                }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '42px' }}>⚖️</span>
                  </div>
                  <p style={{ fontWeight: '600', color: '#ffffff', fontSize: '15px' }}>Workspace Empty</p>
                  <p style={{ fontSize: '12px', maxWidth: '300px', margin: '6px 0 0 0', lineHeight: '1.6' }}>Upload a legal notice document on the left to start parsing structured parameters.</p>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  
                  {/* Workspace tab menu selector */}
                  <div style={{ 
                    display: 'flex', 
                    borderBottom: '1px solid var(--color-border)',
                    marginBottom: '24px',
                    gap: '8px'
                  }}>
                    {['summary', 'laws', 'checklist', 'template', 'chat'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          background: 'none',
                          border: 'none',
                          borderBottom: activeTab === tab ? '2.5px solid var(--color-accent-indigo)' : 'none',
                          color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                          padding: '12px 20px',
                          cursor: 'pointer',
                          fontSize: '13.5px',
                          fontWeight: '800',
                          textTransform: 'capitalize',
                          outline: 'none',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          fontFamily: 'var(--font-header)'
                        }}
                      >
                        {tab === 'chat' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <ChatIcon size={14} color={activeTab === 'chat' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'} />
                            {language === 'english' ? 'Nyaya Chat' : 'న్యాయ చాట్'}
                          </span>
                        ) : tab === 'template' ? (
                          language === 'english' ? 'Response Draft' : 'ప్రత్యుత్తర నమూనా'
                        ) : (
                          language === 'english' ? tab : t(tab + 'Title') || tab
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Render Tabs content */}
                  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Summary Tab */}
                    {activeTab === 'summary' && displayAnalysis && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s' }}>
                        {analysis?.extracted_dates.some(d => d.urgency === 'High') && (
                          <div style={{ 
                            padding: '20px', 
                            background: 'rgba(239, 68, 68, 0.05)', 
                            borderLeft: '4px solid var(--color-danger)',
                            borderRadius: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            borderLeftWidth: '4px',
                            boxShadow: '0 8px 24px rgba(239,68,68,0.05)'
                          }}>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', color: '#f87171', fontWeight: '800', fontFamily: 'var(--font-header)' }}>
                              ⚠️ ALERT: IMMINENT LEGAL ACTIONS
                            </h4>
                            <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.7', color: '#fca5a5' }}>
                              {t('warningText')}
                            </p>
                          </div>
                        )}

                        <div className="glass-card" style={{ padding: '28px', background: 'rgba(255,255,255,0.015)' }}>
                          <h3 style={{ margin: '0 0 16px 0', fontSize: '14.5px', fontWeight: '800', color: 'var(--color-accent-indigo)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            {t('plainExTitle')}
                          </h3>
                          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                            {displayAnalysis.summary}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Laws Tab */}
                    {activeTab === 'laws' && displayAnalysis && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800', color: 'var(--color-text-primary)', letterSpacing: '0.5px' }}>
                          {t('legalCitations')}
                        </h3>
                        {displayAnalysis.legal_references.map((l, idx) => (
                          <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--color-accent-indigo)', background: 'rgba(99, 102, 241, 0.02)' }} key={idx}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '800', color: 'var(--color-accent-gold)', letterSpacing: '0.2px' }}>
                              {l.section}
                            </h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                              {l.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Checklist Tab */}
                    {activeTab === 'checklist' && displayAnalysis && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s' }}>
                        <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                          {t('checklistTitle')}
                        </h3>
                        
                        <div className="glass-card" style={{ padding: '28px', background: 'rgba(255,255,255,0.01)' }}>
                          <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {displayAnalysis.checklist.map((step, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13.5px', color: 'var(--color-text-secondary)', gap: '4px' }}>
                                <input type="checkbox" />
                                <span style={{ marginTop: '2px', lineHeight: '1.6' }}>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Response Template Tab */}
                    {activeTab === 'template' && displayAnalysis && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                            {language === 'english' ? 'Response Template Editor' : 'ప్రత్యుత్తర లేఖ ఎడిటర్'}
                          </h3>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Copy Button */}
                            <button 
                              onClick={() => handleCopyToClipboard(editedTemplate)}
                              className="glow-btn"
                              style={{ fontSize: '11px', padding: '8px 16px', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <CopyIcon color="#ffffff" size={14} /> {t('copyBtn')}
                            </button>
                            
                            {/* Download PDF Button */}
                            <button 
                              onClick={() => handleDownloadPDF(editedTemplate)}
                              className="glow-btn"
                              style={{ 
                                fontSize: '11px', 
                                padding: '8px 16px', 
                                borderRadius: '14px', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                background: 'linear-gradient(135deg, var(--color-accent-indigo) 0%, var(--color-accent-purple) 100%)'
                              }}
                            >
                              <FileIcon color="#ffffff" size={14} /> {language === 'english' ? 'Download PDF' : 'PDF డౌన్‌లోడ్'}
                            </button>

                            {/* Expand/Compress Button */}
                            <button 
                              onClick={() => setIsTemplateExpanded(!isTemplateExpanded)}
                              style={{
                                background: 'rgba(120, 120, 120, 0.08)',
                                border: '1px solid var(--color-border)',
                                padding: '8px 12px',
                                borderRadius: '14px',
                                color: 'var(--color-text-primary)',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '800',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                                outline: 'none'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(120, 120, 120, 0.15)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(120, 120, 120, 0.08)'}
                            >
                              {isTemplateExpanded ? (
                                <>
                                  <MinimizeIcon color="var(--color-text-primary)" size={14} />
                                  <span>{language === 'english' ? 'Compress' : 'కుదించు'}</span>
                                </>
                              ) : (
                                <>
                                  <MaximizeIcon color="var(--color-text-primary)" size={14} />
                                  <span>{language === 'english' ? 'Expand' : 'విస్తరించు'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Editor Textarea container */}
                        <div style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '280px'
                        }}>

                          <div style={{ background: '#0b0f19', padding: '10px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>nyaya_response_draft.txt</span>
                            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)', padding: '2px 8px', borderRadius: '6px' }}>Editable</span>
                          </div>
                          <textarea 
                            value={editedTemplate}
                            onChange={(e) => setEditedTemplate(e.target.value)}
                            style={{
                              width: '100%',
                              flex: 1,
                              background: '#040711',
                              border: 'none',
                              padding: '24px',
                              color: '#a7f3d0',
                              fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                              fontSize: '13px',
                              resize: 'none',
                              outline: 'none',
                              boxSizing: 'border-box',
                              lineHeight: '1.8',
                              display: 'block',
                              margin: 0
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden', animation: 'fadeIn 0.3s' }}>
                        {/* Conversation bubbles list */}
                        <div style={{ 
                          flex: 1, 
                          overflowY: 'auto', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '20px', 
                          paddingBottom: '24px',
                          maxHeight: 'calc(100vh - 360px)'
                        }}>
                          {chatMessages.map((msg, idx) => {
                            const isUser = msg.role === 'user';
                            return (
                              <div 
                                key={idx} 
                                style={{ 
                                  display: 'flex', 
                                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                                  width: '100%',
                                  gap: '12px'
                                }}
                              >
                                {!isUser && (
                                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-gold) 0%, #d97706 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
                                    🤖
                                  </div>
                                )}
                                <div style={{ 
                                  maxWidth: '75%', 
                                  background: isUser ? 'linear-gradient(135deg, var(--color-accent-indigo) 0%, var(--color-accent-purple) 100%)' : 'rgba(255, 255, 255, 0.03)',
                                  color: '#ffffff',
                                  padding: '14px 20px',
                                  borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
                                  border: isUser ? 'none' : '1px solid var(--color-border)',
                                  fontSize: '13px',
                                  lineHeight: '1.7',
                                  whiteSpace: 'pre-wrap',
                                  boxShadow: isUser ? '0 8px 24px rgba(99, 102, 241, 0.25)' : '0 8px 24px rgba(0,0,0,0.3)',
                                  fontFamily: 'var(--font-body)'
                                }}>
                                  {msg.content}
                                </div>
                                {isUser && (
                                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-indigo) 0%, var(--color-accent-purple) 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: '800', color: '#ffffff', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                                    HM
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {isSendingChat && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-gold) 0%, #d97706 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
                                🤖
                              </div>
                              <div style={{ 
                                background: 'rgba(255, 255, 255, 0.02)',
                                color: 'var(--color-text-secondary)',
                                padding: '14px 20px',
                                borderRadius: '20px 20px 20px 0',
                                border: '1px solid var(--color-border)',
                                fontSize: '13px',
                                fontFamily: 'var(--font-body)'
                              }}>
                                {t('thinkingText')}
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Chat interactive input */}
                        <form 
                          onSubmit={handleSendChat}
                          style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            padding: '16px 0 0 0', 
                            borderTop: '1px solid var(--color-border)',
                            marginTop: 'auto'
                          }}
                        >
                          <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={t('chatPlaceholder')}
                            disabled={isSendingChat}
                            style={{
                              flex: 1,
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '30px',
                              padding: '14px 24px',
                              color: '#ffffff',
                              fontSize: '13.5px',
                              outline: 'none',
                              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                          />
                          <button 
                            type="submit" 
                            disabled={isSendingChat || !chatInput.trim()}
                            className="glow-btn"
                            style={{ padding: '8px 28px', opacity: (isSendingChat || !chatInput.trim()) ? 0.5 : 1 }}
                          >
                            {t('sendBtn')}
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </section>
          </div> {/* Closing upper grid wrapper */}

          {/* Bottom Row: Metrics/Stats Row */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '8px' }}>
            
            {/* Stat 1: Total Documents */}
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Documents
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <FileIcon size={16} color="var(--color-accent-indigo)" />
                </div>
              </div>
              <h3 style={{ margin: '4px 0', fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                {fileUploaded ? 19 : 18}
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--color-success)', fontWeight: '700' }}>
                ↑ 12% from last month
              </span>
            </div>

            {/* Stat 2: Active Cases */}
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Active Cases
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ScaleIcon size={16} color="var(--color-success)" />
                </div>
              </div>
              <h3 style={{ margin: '4px 0', fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                7
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--color-success)', fontWeight: '700' }}>
                ↑ 8% from last month
              </span>
            </div>

            {/* Stat 3: Urgent Alerts */}
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Urgent Alerts
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BoltIcon size={16} color="var(--color-danger)" />
                </div>
              </div>
              <h3 style={{ margin: '4px 0', fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                {fileUploaded && analysis?.extracted_dates.some(d => d.urgency === 'High') ? 4 : 3}
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--color-danger)', fontWeight: '700' }}>
                ↑ 20% from last month
              </span>
            </div>

            {/* Stat 4: Completed Analyses */}
            <div className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Analyses Run
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LibraryIcon size={16} color="var(--color-accent-purple)" />
                </div>
              </div>
              <h3 style={{ margin: '4px 0', fontSize: '24px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                {fileUploaded ? 25 : 24}
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--color-success)', fontWeight: '700' }}>
                ↑ 15% from last month
              </span>
            </div>

          </div>

          {/* Fullscreen Expanded Template Editor Overlay */}
          {isTemplateExpanded && activeTab === 'template' && displayAnalysis && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: '#040711',
              borderRadius: '20px',
              border: '2px solid var(--color-accent-indigo)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{ background: '#0b0f19', padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-header)' }}>
                  {language === 'english' ? 'Response Template - Fullscreen Editor' : 'ప్రత్యుత్తర లేఖ - పూర్తి స్క్రీన్ ఎడిటర్'}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleCopyToClipboard(editedTemplate)}
                    className="glow-btn"
                    style={{ fontSize: '11px', padding: '8px 16px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CopyIcon color="#ffffff" size={14} /> {t('copyBtn')}
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(editedTemplate)}
                    className="glow-btn"
                    style={{ 
                      fontSize: '11px', 
                      padding: '8px 16px', 
                      borderRadius: '12px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      background: 'linear-gradient(135deg, var(--color-accent-indigo) 0%, var(--color-accent-purple) 100%)'
                    }}
                  >
                    <FileIcon color="#ffffff" size={14} /> {language === 'english' ? 'Download PDF' : 'PDF డౌన్‌లోడ్'}
                  </button>
                  <button 
                    onClick={() => setIsTemplateExpanded(false)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '800',
                      outline: 'none'
                    }}
                  >
                    ✕ {language === 'english' ? 'Close' : 'మూసివేయి'}
                  </button>
                </div>
              </div>
              <div style={{ background: '#080c18', padding: '10px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-text-secondary)' }}>nyaya_response_draft.txt</span>
                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-secondary)', padding: '2px 8px', borderRadius: '6px' }}>Editable Mode</span>
              </div>
              <textarea 
                value={editedTemplate}
                onChange={(e) => setEditedTemplate(e.target.value)}
                style={{
                  width: '100%',
                  flex: 1,
                  background: '#040711',
                  border: 'none',
                  padding: '32px',
                  color: '#a7f3d0',
                  fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                  fontSize: '13.5px',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: '1.8',
                  display: 'block',
                  margin: 0
                }}
              />
            </div>
          )}

        </main>
      ) : activeNav === 'library' ? (
          /* Laws Library portal */
          <main style={{ flex: 1, padding: '36px 56px', overflowY: 'auto', animation: 'fadeIn 0.3s' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-header)' }}>
                  {language === 'english' ? 'Statutory Reference Knowledge Base' : 'చట్టపరమైన నిబంధనల విజ్ఞాన సర్వస్వం'}
                </h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                  {language === 'english' 
                    ? "Browse default Indian statutory rules governing landlord-tenant leases, cheque bounces, utility grids and public defamation suits."
                    : "అద్దె నిబంధనలు, చెక్కు బౌన్స్ క్రిమినల్ నోటీసులు, విద్యుత్ సరఫరా నిలిపివేత మరియు పరువు నష్టం కేసులను నియంత్రించే చట్టాలను బ్రౌజ్ చేయండి."
                  }
                </p>
              </div>

              {/* Category selector pills */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                flexWrap: 'wrap', 
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--color-border)'
              }}>
                {(categories.length > 0 ? categories : ['All', 'Tenancy & Housing', 'Finance & Banking', 'Consumer Rights', 'Utilities & Services', 'Civil, Personal & Cyber']).map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setExpandedLawId(null);
                      }}
                      style={{
                        background: isSelected ? 'var(--color-accent-indigo)' : 'rgba(255, 255, 255, 0.02)',
                        color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                        border: isSelected ? '1px solid var(--color-accent-indigo)' : '1px solid var(--color-border)',
                        borderRadius: '30px',
                        padding: '8px 18px',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'var(--font-header)',
                        outline: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {getCategoryIcon(cat, isSelected ? '#ffffff' : 'var(--color-text-secondary)')}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar Input */}
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'english' ? "🔍 Search laws by act name, scope, summary or keyword..." : "🔍 చట్టాల పేరు, పరిధి, సారాంశం లేదా కీవర్డ్ ద్వారా శోధించండి..."}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '14px 20px 14px 44px',
                    color: 'var(--color-text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '18px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '800',
                      outline: 'none'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {filteredLaws.length > 0 ? (
                filteredLaws.map((law, idx) => {
                  const isExpanded = expandedLawId === law.id;
                  return (
                    <div 
                      key={law.id || idx} 
                      className="glass-card" 
                      style={{ 
                        padding: '24px 28px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px',
                        cursor: 'pointer',
                        border: isExpanded ? '1px solid var(--color-accent-indigo)' : '1px solid var(--color-border)',
                        boxShadow: isExpanded ? '0 12px 32px rgba(99, 102, 241, 0.15)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onClick={() => setExpandedLawId(isExpanded ? null : law.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: isExpanded ? 'var(--color-accent-indigo)' : 'var(--color-accent-gold)', letterSpacing: '0.2px', fontFamily: 'var(--font-header)', transition: 'color 0.2s' }}>
                          {law.act}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '10px', 
                            background: 'rgba(99, 102, 241, 0.08)', 
                            color: '#c7d2fe', 
                            padding: '4px 12px', 
                            borderRadius: '20px', 
                            fontWeight: '800',
                            border: '1px solid rgba(99, 102, 241, 0.15)',
                            fontFamily: 'var(--font-header)',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}>
                            {law.scope}
                          </span>
                          <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: 'var(--color-text-primary)', fontWeight: '500', lineHeight: '1.6' }}>
                        {law.summary}
                      </p>
                      
                      {/* Accordion Expanded Details */}
                      {isExpanded && (
                        <div 
                          style={{ 
                            marginTop: '12px',
                            paddingTop: '16px',
                            borderTop: '1px dashed var(--color-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            animation: 'fadeIn 0.2s ease-out'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '800', color: 'var(--color-accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Detailed Legal Description
                            </h5>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                              {law.details}
                            </p>
                          </div>
                          
                          {law.remedies && law.remedies.length > 0 && (
                            <div>
                              <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Recommended Citizen Actions & Remedies
                              </h5>
                              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {law.remedies.map((rem: string, rIdx: number) => (
                                  <li key={rIdx} style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                    {rem}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {law.keywords && law.keywords.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                              {law.keywords.map((kw: string, kIdx: number) => (
                                <span key={kIdx} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
                                  #{kw}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  {lawsList.length === 0 ? "Loading laws library entries..." : (language === 'english' ? "No matching laws found." : "సరిపోలే చట్టాలు కనుగొనబడలేదు.")}
                </div>
              )}
            </div>
          </main>
        ) : activeNav === 'schedule' ? (
          /* Milestones calendar view */
          <main style={{ flex: 1, padding: '36px 56px', overflowY: 'auto', animation: 'fadeIn 0.3s' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-header)' }}>
                  {language === 'english' ? 'Notice Critical Deadlines & Milestone Schedules' : 'నోటీసు గడువు తేదీలు & షెడ్యూల్ పట్టిక'}
                </h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                  {language === 'english' 
                    ? "Generate downloadable calendar invites (.ics) to synchronize with Google Calendar or MS Outlook."
                    : "గడువులను గూగుల్ క్యాలెండర్ లేదా ఔట్‌లుక్‌తో సమకాలీకరించడానికి క్యాలెండర్ ఫైల్‌లను (.ics) డౌన్‌లోడ్ చేసుకోండి."
                  }
                </p>
              </div>

              {displayAnalysis && displayAnalysis.extracted_dates.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {displayAnalysis.extracted_dates.map((m, idx) => {
                    const daysLeft = getRemainingDays(m.date);
                    const isHigh = m.urgency === 'High';
                    
                    return (
                      <div key={idx} className="glass-card" style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: isHigh ? '4px solid var(--color-danger)' : '4px solid var(--color-accent-gold)', borderLeftWidth: '4px' }}>
                        <div>
                          <span style={{ 
                            fontSize: '10px', 
                            background: isHigh ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                            color: isHigh ? '#fca5a5' : '#fde047', 
                            padding: '5px 14px', 
                            borderRadius: '20px', 
                            fontWeight: '800',
                            display: 'inline-block',
                            marginBottom: '12px',
                            border: isHigh ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                            fontFamily: 'var(--font-header)',
                            letterSpacing: '0.5px'
                          }}>
                            {m.urgency.toUpperCase()} URGENCY
                          </span>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-header)' }}>
                            {m.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                            Scheduled Date: <strong style={{ color: '#ffffff' }}>{m.date}</strong> ({daysLeft > 0 ? `${daysLeft} ${t('daysRemaining')}` : daysLeft === 0 ? t('todayText') : t('passedText')})
                          </p>
                        </div>
                        <button 
                          onClick={() => handleCalendarDownload(m.date, m.title)}
                          className="glow-btn"
                          style={{ fontSize: '12.5px', padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                          <ScheduleIcon color="#ffffff" size={14} /> {t('downloadCal')}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}><ScheduleIcon color="var(--color-accent-indigo)" size={64} /></span>
                  <p style={{ fontSize: '15px', color: '#ffffff', fontWeight: '600' }}>No Active Notice Data</p>
                  <p style={{ fontSize: '12.5px', maxWidth: '320px', margin: '8px auto 0 auto', lineHeight: '1.6' }}>Upload a legal document in the Dashboard to automatically populate and download calendar invite triggers.</p>
                </div>
              )}
            </div>
          </main>
        ) : (
          /* Settings & Profile view */
          <main style={{ flex: 1, padding: '36px 56px', overflowY: 'auto', animation: 'fadeIn 0.3s' }}>
            <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-header)' }}>
                  {language === 'english' ? 'Settings & Personal Profile' : 'సెట్టింగులు & ప్రొఫైల్'}
                </h3>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
                  {language === 'english' 
                    ? "Manage your default contact information, interface language, and display theme settings."
                    : "మీ సాధారణ సంప్రదింపు సమాచారం, భాష మరియు ప్రదర్శన థీమ్ సెట్టింగ్‌లను నిర్వహించండి."
                  }
                </p>
              </div>

              <div className="glass-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Form Group: Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {language === 'english' ? 'Full Name' : 'పూర్తి పేరు'}
                  </label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => {
                      setUserName(e.target.value);
                      localStorage.setItem('nyayamitra_user_name', e.target.value);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>

                {/* Form Group: Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {language === 'english' ? 'Email Address' : 'ఈమెయిల్ చిరునామా'}
                  </label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      localStorage.setItem('nyayamitra_user_email', e.target.value);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>

                {/* Form Group: Phone Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {language === 'english' ? 'Phone Number' : 'ఫోన్ నంబర్'}
                  </label>
                  <input 
                    type="text" 
                    value={userPhone} 
                    onChange={(e) => {
                      setUserPhone(e.target.value);
                      localStorage.setItem('nyayamitra_user_phone', e.target.value);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                </div>

                {/* Settings Actions / Save Confirmation */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    onClick={() => {
                      setToastText(language === 'english' ? 'Profile details saved locally!' : 'ప్రొఫైల్ వివరాలు సేవ్ చేయబడ్డాయి!');
                      setShowCopyToast(true);
                      setTimeout(() => setShowCopyToast(false), 2500);
                    }}
                    className="glow-btn"
                    style={{ padding: '12px 36px' }}
                  >
                    {language === 'english' ? 'Save Changes' : 'మార్పులను సేవ్ చేయి'}
                  </button>
                </div>

              </div>
            </div>
          </main>
        )}
      </div>

      {/* 5. Glassmorphic Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(3, 7, 18, 0.6)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div className="glass-card" style={{
            width: '420px',
            padding: '40px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button 
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '18px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><LockIcon color="var(--color-accent-indigo)" size={36} /></span>
              <h2 style={{ margin: '12px 0 6px 0', fontSize: '22px', fontWeight: '800', color: 'var(--color-text-primary)', fontFamily: 'var(--font-header)' }}>
                {language === 'english' ? 'Sign In Required' : 'లాగిన్ అవసరం'}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {language === 'english' ? 'Please log in to export notice milestones to your personal calendar.' : 'మీ వ్యక్తిగత క్యాలెండర్‌కు మైలురాళ్లను సమకాలీకరించడానికి దయచేసి లాగిన్ చేయండి.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {language === 'english' ? 'Email Address' : 'ఈమెయిల్ చిరునామా'}
                </label>
                <input 
                  type="text" 
                  placeholder="hansh@nyayamitra.ai" 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {language === 'english' ? 'Password' : 'పాస్‌వర్డ్'}
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'var(--color-text-primary)',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button 
              onClick={() => {
                setIsLoggedIn(true);
                setShowLoginModal(false);
                setToastText(language === 'english' ? 'Logged in successfully! Exporting calendar...' : 'విజయవంతంగా లాగిన్ అయ్యారు! క్యాలెండర్ ఎగుమతి అవుతోంది...');
                setShowCopyToast(true);
                setTimeout(() => {
                  setShowCopyToast(false);
                }, 2500);

                if (pendingCalendar) {
                  // Direct download with isLoggedIn = true
                  const fetchAndDownload = async () => {
                    try {
                      const url = `/api/calendar?date=${pendingCalendar.date}&title=${encodeURIComponent(pendingCalendar.title)}`;
                      const response = await fetch(url);
                      const data = await response.json();
                      
                      if (data.ics_file_content) {
                        const element = document.createElement("a");
                        const file = new Blob([data.ics_file_content], { type: 'text/calendar' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${pendingCalendar.title.toLowerCase().replace(/ /g, '_')}_reminder.ics`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  };
                  fetchAndDownload();
                  setPendingCalendar(null);
                }
              }}
              className="glow-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px'
              }}
            >
              {language === 'english' ? 'Sign In & Sync' : 'లాగిన్ & సమకాలీకరణ'}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '8px 0 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              <span>{language === 'english' ? "Don't have an account?" : "ఖాతా లేదా?"}</span>
              <a href="#" style={{ color: 'var(--color-accent-indigo)', fontWeight: '600', textDecoration: 'none' }}>
                {language === 'english' ? 'Sign Up' : 'నమోదు చేయండి'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
