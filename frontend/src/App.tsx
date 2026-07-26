import React, { useState, useRef, useEffect } from 'react'

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

export default function App() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [language, setLanguage] = useState('english');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard'); // Navigation bar state

  // Full-stack state hooks
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [translatedAnalysis, setTranslatedAnalysis] = useState<AnalysisData | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Chat interface states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll chat to bottom when message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTab]);

  // Translate all analysis components on-the-fly when Telugu is selected
  useEffect(() => {
    if (language === 'telugu' && analysis) {
      triggerTranslation();
    } else {
      setTranslatedAnalysis(null);
    }
  }, [language, analysis]);

  const triggerTranslation = async () => {
    if (!analysis) return;
    try {
      // 1. Translate Summary
      const summaryRes = await translateText(analysis.summary, 'telugu');
      
      // 2. Translate Milestones
      const translatedMilestones = await Promise.all(
        analysis.extracted_dates.map(async (m) => ({
          ...m,
          title: await translateText(m.title, 'telugu')
        }))
      );

      // 3. Translate Laws
      const translatedLaws = await Promise.all(
        analysis.legal_references.map(async (l) => ({
          section: l.section,
          description: await translateText(l.description, 'telugu')
        }))
      );

      // 4. Translate Checklist
      const translatedChecklist = await Promise.all(
        analysis.checklist.map(async (step) => await translateText(step, 'telugu'))
      );

      // 5. Translate Response Template
      const translatedTemplate = await translateText(analysis.response_template, 'telugu');

      setTranslatedAnalysis({
        summary: summaryRes,
        extracted_dates: translatedMilestones,
        legal_references: translatedLaws,
        checklist: translatedChecklist,
        response_template: translatedTemplate
      });
    } catch (err) {
      console.error("Translation api failure:", err);
      // Fallback
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
      return `[TELUGU] ${text}`;
    }
  };

  // Handle file trigger click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Perform file upload and call backend API
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
        throw new Error(`Upload failed with status code ${response.status}`);
      }

      const data: UploadResponse = await response.json();
      
      setDocumentId(data.document_id);
      setDocType(data.doc_type);
      setRawText(data.raw_text || '');
      setAnalysis(data.analysis);
      setChatMessages([
        { role: 'assistant', content: `Hello! I have analyzed "${selectedFile.name}" and added it to the active context. How can I help you understand this notice today?` }
      ]);
      setFileUploaded(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong during file analysis.");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Send a message to /api/chat
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
        throw new Error("Chat api failed to respond.");
      }

      const data = await response.json();
      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: `Sorry, I encountered an error connecting to the database: ${err.message}` }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Reset uploader state
  const handleReset = () => {
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

  const getRemainingDays = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper to read currently selected active translation layout
  const displayAnalysis = language === 'telugu' && translatedAnalysis ? translatedAnalysis : analysis;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Sleek Navigation Bar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 40px',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>⚖️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              NyayaMitra AI
            </h1>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-accent-gold)', letterSpacing: '1px' }}>
              UNDERSTAND BEFORE YOU ACT
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '24px' }}>
          {['dashboard', 'laws library', 'case schedule'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              style={{
                background: 'none',
                border: 'none',
                color: activeNav === item ? 'var(--color-accent-indigo)' : 'var(--color-text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                cursor: 'pointer',
                paddingBottom: '4px',
                borderBottom: activeNav === item ? '2px solid var(--color-accent-indigo)' : 'none'
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Language Selector Toggle */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--color-accent-navy)', 
            padding: '4px', 
            borderRadius: '20px', 
            border: '1px solid var(--color-border)' 
          }}>
            <button 
              onClick={() => setLanguage('english')}
              style={{
                background: language === 'english' ? 'var(--color-accent-indigo)' : 'none',
                color: '#ffffff',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('telugu')}
              style={{
                background: language === 'telugu' ? 'var(--color-accent-indigo)' : 'none',
                color: '#ffffff',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              తెలుగు
            </button>
          </div>

          <a href="https://github.com/hanshikavelaga/Nyaya_mitra" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '13px' }}>
            GitHub
          </a>
        </div>
      </header>

      {/* Main Workspace Layout */}
      {activeNav === 'dashboard' ? (
        <main style={{ flex: 1, display: 'flex', padding: '32px 40px', gap: '32px' }}>
          {/* Left Pane: Ingest / Upload Zone */}
          <section className="glass-card" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 'bold' }}>
              1. Document Ingestion
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
                  border: '2px dashed var(--color-border)', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  padding: '24px',
                  cursor: 'pointer',
                  background: isUploading ? 'rgba(255,255,255,0.01)' : 'none'
                }} 
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <>
                    <span style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 1.5s linear infinite' }} className="loader-icon">⌛</span>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Analyzing legal document...</p>
                    <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Extracting text with Gemini AI</p>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '48px', marginBottom: '16px' }}>📄</span>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Drag & drop your notice file here</p>
                    <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Supports PDF, PNG, JPEG up to 10MB</p>
                    <button className="glow-btn">Browse File</button>
                    {error && <p style={{ margin: '16px 0 0 0', color: 'var(--color-danger)', fontSize: '12px' }}>{error}</p>}
                  </>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '24px' }}>📄</span>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {file?.name || "uploaded_notice.pdf"}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        {(file ? (file.size / 1024 / 1024).toFixed(1) : "1.2")} MB | {docType} | Database ID: #{documentId}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleReset}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>

                {/* 2. Dynamic Notice File Preview Box */}
                <div style={{ 
                  flex: 1, 
                  background: '#ffffff', 
                  color: '#1e293b', 
                  borderRadius: '8px', 
                  padding: '24px', 
                  fontSize: '12px', 
                  lineHeight: '1.6', 
                  overflowY: 'auto',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-accent-navy)' }}>
                    {docType} Text Ingestion
                  </h3>
                  <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {rawText || "Reading document bytes..."}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Right Pane: Analysis Workspace Panel */}
          <section className="glass-card" style={{ flex: 1.2, padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                2. AI Analysis Workspace
              </h2>
              
              {/* Audio Synthesis Mock Buttons */}
              {fileUploaded && activeTab !== 'chat' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                    style={{
                      background: isPlayingVoice ? 'var(--color-accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                      color: isPlayingVoice ? '#0f172a' : '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{isPlayingVoice ? '⏸️' : '🔊'}</span>
                    <span>{isPlayingVoice ? 'Pause Audio' : 'Listen Summary'}</span>
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
              color: 'var(--color-text-secondary)'
            }}>
              <span style={{ fontSize: '48px', marginBottom: '16px' }}>⚖️</span>
              <p>Upload a notice document on the left to start analysis.</p>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Tab Navigation header */}
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '16px',
                gap: '4px'
              }}>
                {['summary', 'timeline', 'laws', 'checklist', 'chat'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid var(--color-accent-indigo)' : 'none',
                      color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab === 'chat' ? '💬 Nyaya Chat' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column' }}>
                
                {/* A. Summary Tab */}
                {activeTab === 'summary' && displayAnalysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {analysis?.extracted_dates.some(d => d.urgency === 'High') && (
                      <div style={{ 
                        padding: '16px', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        borderLeft: '4px solid var(--color-danger)',
                        borderRadius: '4px'
                      }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-danger)', fontWeight: 'bold' }}>
                          ⚠️ {language === 'english' ? 'Urgent Warning' : 'అత్యవసర హెచ్చరిక'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px' }}>
                          {language === 'english' 
                            ? "This document contains high-urgency deadlines. Please review the timeline and checklists immediately."
                            : "ఈ పత్రంలో అత్యవసర గడువులు ఉన్నాయి. దయచేసి గడువు తేదీలు మరియు తదుపరి చర్యలను వెంటనే పరిశీలించండి."
                          }
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                        {language === 'english' ? 'Plain Language Explanation' : 'సాధారణ భాషా వివరణ'}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                        {displayAnalysis.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* B. Timeline Tab */}
                {activeTab === 'timeline' && displayAnalysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                      {language === 'english' ? 'Critical Milestones Timeline' : 'కీలక గడువుల కాలక్రమం'}
                    </h3>
                    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {displayAnalysis.extracted_dates.map((m, idx) => {
                        const daysLeft = getRemainingDays(m.date);
                        const isHigh = m.urgency === 'High';
                        
                        return (
                          <div style={{ position: 'relative' }} key={idx}>
                            <div style={{ 
                              position: 'absolute', 
                              left: '-30px', 
                              top: '4px', 
                              width: '10px', 
                              height: '10px', 
                              borderRadius: '50%', 
                              background: isHigh ? 'var(--color-danger)' : 'var(--color-accent-indigo)' 
                            }} />
                            <p style={{ margin: 0, fontSize: '11px', color: isHigh ? 'var(--color-danger)' : 'var(--color-text-secondary)', fontWeight: isHigh ? 'bold' : 'normal' }}>
                              {m.date} ({daysLeft > 0 ? `${daysLeft} Days Remaining` : daysLeft === 0 ? "Today" : "Passed"})
                            </p>
                            <h4 style={{ margin: '2px 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: isHigh ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
                              {m.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                              Urgency Level: {m.urgency}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* C. Laws Tab */}
                {activeTab === 'laws' && displayAnalysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                      {language === 'english' ? 'Relevant Legal Citations' : 'సంబంధిత చట్టపరమైన ఆధారాలు'}
                    </h3>
                    {displayAnalysis.legal_references.map((l, idx) => (
                      <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid var(--color-accent-indigo)' }} key={idx}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-accent-indigo)' }}>
                          {l.section}
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                          {l.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* D. Checklist Tab */}
                {activeTab === 'checklist' && displayAnalysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                      {language === 'english' ? 'Recommended Next Steps' : 'సిఫార్సు చేయబడిన తదుపరి చర్యలు'}
                    </h3>
                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                      {displayAnalysis.checklist.map((step, idx) => (
                        <li key={idx}>
                          <input type="checkbox" style={{ marginRight: '8px' }} />
                          {step}
                        </li>
                      ))}
                    </ul>

                    {/* Autogenerated Response Draft */}
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>
                        {language === 'english' ? 'Autogenerated Response Template' : 'స్వయంచాలక ప్రత్యుత్తర నమూనా'}
                      </h4>
                      <textarea 
                        readOnly 
                        value={displayAnalysis.response_template}
                        style={{
                          width: '95%',
                          height: '110px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          padding: '12px',
                          color: 'var(--color-text-primary)',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          resize: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Fully Functional Chat Assistant Panel (Tab E) */}
                {activeTab === 'chat' && (
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
                    {/* Chat Bubble List */}
                    <div style={{ 
                      flex: 1, 
                      overflowY: 'auto', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px', 
                      paddingBottom: '16px',
                      maxHeight: 'calc(100vh - 340px)'
                    }}>
                      {chatMessages.map((msg, idx) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex', 
                              justifyContent: isUser ? 'flex-end' : 'flex-start',
                              width: '100%' 
                            }}
                          >
                            <div style={{ 
                              maxWidth: '80%', 
                              background: isUser ? 'var(--color-accent-indigo)' : 'rgba(255, 255, 255, 0.05)',
                              color: '#ffffff',
                              padding: '10px 14px',
                              borderRadius: isUser ? '12px 12px 0 12px' : '12px 12px 12px 0',
                              border: isUser ? 'none' : '1px solid var(--color-border)',
                              fontSize: '12.5px',
                              lineHeight: '1.5',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {msg.content}
                            </div>
                          </div>
                        );
                      })}
                      {isSendingChat && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ 
                            background: 'rgba(255, 255, 255, 0.02)',
                            color: 'var(--color-text-secondary)',
                            padding: '10px 14px',
                            borderRadius: '12px 12px 12px 0',
                            border: '1px solid var(--color-border)',
                            fontSize: '12px'
                          }}>
                            Thinking... ⌛
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input form */}
                    <form 
                      onSubmit={handleSendChat}
                      style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        padding: '8px 0', 
                        borderTop: '1px solid var(--color-border)',
                        marginTop: 'auto'
                      }}
                    >
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a follow-up question..."
                        disabled={isSendingChat}
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '20px',
                          padding: '10px 18px',
                          color: '#ffffff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <button 
                        type="submit" 
                        disabled={isSendingChat || !chatInput.trim()}
                        style={{
                          background: 'var(--color-accent-indigo)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '8px 20px',
                          fontSize: '12.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          opacity: (isSendingChat || !chatInput.trim()) ? 0.5 : 1
                        }}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          )}
        </section>
      </main>
      ) : (
        /* Empty pages for placeholder navigation options */
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '48px' }}>📚</span>
            <p style={{ marginTop: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>
              {activeNav} Portal is under active development. Keep utilizing Dashboard.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
