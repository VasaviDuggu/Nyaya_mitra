import React, { useState, useRef } from 'react'

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
  uploaded_at: string;
  analysis: AnalysisData;
}

export default function App() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [language, setLanguage] = useState('english');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Full-stack state hooks
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setAnalysis(data.analysis);
      setFileUploaded(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong during file analysis.");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Reset uploader state
  const handleReset = () => {
    setFile(null);
    setFileUploaded(false);
    setDocumentId(null);
    setAnalysis(null);
    setDocType('');
    setError(null);
    setActiveTab('summary');
    setIsPlayingVoice(false);
  };

  // Drag and drop events handlers
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

  // Calculate countdown warning days dynamically
  const getRemainingDays = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 40px',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>⚖️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              NyayaMitra AI
            </h1>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-accent-gold)', letterSpacing: '1px' }}>
              UNDERSTAND BEFORE YOU ACT
            </p>
          </div>
        </div>

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
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '12px',
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
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              తెలుగు (Telugu)
            </button>
          </div>

          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '14px' }}>
            GitHub Repository
          </a>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main style={{ flex: 1, display: 'flex', padding: '32px 40px', gap: '32px' }}>
        {/* Left Pane: Ingest / Upload Zone */}
        <section className="glass-card" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

              {/* Document Image/Text Preview Box */}
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
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase' }}>
                  {docType}
                </h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  <strong>NOTICE FILE DETAIL PREVIEW:</strong><br />
                  Uploaded Document: {file?.name}<br /><br />
                  Gemini API successfully executed native multimodal OCR. The extracted core summary and deadlines are displayed in the workspace on the right. You can now toggle tabs to read citations, next steps, or ask follow-up questions.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Right Pane: Analysis Workspace Panel */}
        <section className="glass-card" style={{ flex: 1.2, padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              2. AI Analysis Workspace
            </h2>
            
            {/* Audio Synthesis Mock Buttons */}
            {fileUploaded && (
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
                gap: '8px'
              }}>
                {['summary', 'timeline', 'laws', 'checklist'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid var(--color-accent-indigo)' : 'none',
                      color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {activeTab === 'summary' && analysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {analysis.extracted_dates.some(d => d.urgency === 'High') && (
                      <div style={{ 
                        padding: '16px', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        borderLeft: '4px solid var(--color-danger)',
                        borderRadius: '4px'
                      }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-danger)', fontWeight: 'bold' }}>
                          ⚠️ Urgent Warning
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
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Plain Language Explanation</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                        {language === 'english'
                          ? analysis.summary
                          : `[తెలుగు అనువాదం] ${analysis.summary}`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && analysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Critical Milestones Timeline</h3>
                    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {analysis.extracted_dates.map((m, idx) => {
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

                {activeTab === 'laws' && analysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Relevant Legal Citations</h3>
                    {analysis.legal_references.map((l, idx) => (
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

                {activeTab === 'checklist' && analysis && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Recommended Next Steps</h3>
                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                      {analysis.checklist.map((step, idx) => (
                        <li key={idx}>
                          <input type="checkbox" style={{ marginRight: '8px' }} />
                          {step}
                        </li>
                      ))}
                    </ul>

                    {/* Autogenerated Response Draft */}
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>Autogenerated Response Template</h4>
                      <textarea 
                        readOnly 
                        value={analysis.response_template}
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
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
