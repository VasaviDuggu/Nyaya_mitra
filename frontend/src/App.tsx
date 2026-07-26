import React, { useState } from 'react'

export default function App() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [language, setLanguage] = useState('english');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleMockUpload = () => {
    setFileUploaded(true);
  };

  const handleReset = () => {
    setFileUploaded(false);
    setActiveTab('summary');
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

          {!fileUploaded ? (
            <div style={{ 
              flex: 1, 
              border: '2px dashed var(--color-border)', 
              borderRadius: '8px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: '24px',
              cursor: 'pointer'
            }} onClick={handleMockUpload}>
              <span style={{ fontSize: '48px', marginBottom: '16px' }}>📄</span>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Drag & drop your notice file here</p>
              <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>Supports PDF, PNG, JPEG up to 10MB</p>
              <button className="glow-btn">Browse File (Demo Upload)</button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>mock_tenant_eviction_notice.pdf</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)' }}>1.2 MB | PDF File</p>
                  </div>
                </div>
                <button 
                  onClick={handleReset}
                  style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '12px' }}
                >
                  Remove
                </button>
              </div>

              {/* Document Image Mockup */}
              <div style={{ 
                flex: 1, 
                background: '#ffffff', 
                color: '#000000', 
                borderRadius: '8px', 
                padding: '24px', 
                fontSize: '11px', 
                lineHeight: '1.6', 
                overflowY: 'auto',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0 0 16px 0', fontSize: '14px' }}>EVICTION NOTICE</h3>
                <p><strong>TO:</strong> Mr. Hansh, Apartment 4B, Greenwood Residencies, Hyderabad.</p>
                <p><strong>DATE:</strong> July 26, 2026</p>
                <p>You are hereby notified that you are in default of your lease agreement dated June 1, 2024. Specifically, you have failed to pay the rent due for July 2026 in the amount of INR 25,000.</p>
                <p>Pursuant to Section 106 of the Transfer of Property Act, you are required to cure this default or vacate the premises within fifteen (15) days from the receipt of this notice, failing which legal proceedings will be initiated against you.</p>
                <p style={{ textAlign: 'right', marginTop: '24px' }}><strong>SENDER:</strong> Greenwood Property Management Ltd.</p>
              </div>
            </div>
          )}
        </section>

        {/* Right Pane: Analysis Workspace Panel */}
        <section className="glass-card" style={{ flex: 1.2, padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
          <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
                {activeTab === 'summary' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                          ? "You have 15 days from receiving this notice to cure the rent default or vacate the apartment. Failure to do so will result in eviction lawsuits."
                          : "ఈ నోటీసు అందిన 15 రోజుల్లోగా మీరు అద్దె చెల్లించవలసి ఉంటుంది, లేనిపక్షంలో తొలగింపు చర్యలు ప్రారంభించబడతాయి."
                        }
                      </p>
                    </div>

                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Plain Language Explanation</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                        {language === 'english'
                          ? "Your landlord, Greenwood Property Management, is claiming that you did not pay rent for July 2026 (INR 25,000). They are giving you 15 days to pay this due. If you do not pay or explain, they have the legal right under Indian law to start eviction proceedings in court."
                          : "మీ ల్యాండ్‌లార్డ్ గ్రీన్‌వుడ్ ప్రాపర్టీ మేనేజ్‌మెంట్ మీ జూలై 2026 నెలవారీ అద్దె (రూ. 25,000) చెల్లించలేదని నోటీసు పంపారు. దీనికి సంబంధించి 15 రోజుల సమయం ఇచ్చారు. ఈ గడువులోగా చెల్లించకపోతే, చట్టపరమైన తొలగింపు చర్యలు చేపడతారు."
                        }
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Critical Milestones Timeline</h3>
                    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Milestone 1 */}
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-indigo)' }} />
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-secondary)' }}>July 26, 2026</p>
                        <h4 style={{ margin: '2px 0 4px 0', fontSize: '13px', fontWeight: 'bold' }}>Notice Received</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Eviction notice served to Greenwood Greenwood Apartment.</p>
                      </div>

                      {/* Milestone 2 */}
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-danger)' }} />
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-danger)', fontWeight: 'bold' }}>August 10, 2026 (15 Days Remaining)</p>
                        <h4 style={{ margin: '2px 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-danger)' }}>Cure Period Deadline</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Last day to submit rent payment due or present landlord dispute papers.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'laws' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Relevant Legal Citations</h3>
                    <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid var(--color-accent-indigo)' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-accent-indigo)' }}>
                        Section 106 - Transfer of Property Act, 1882
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                        States that a lease of immovable property from month to month can only be terminated by giving a 15-day notice in writing. If the landlord does not serve you a written notice 15 days in advance, the eviction proceeding can be dismissed in court.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Recommended Next Steps</h3>
                    <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                      <li>
                        <input type="checkbox" style={{ marginRight: '8px' }} />
                        <strong>Verify Receipts:</strong> Check if Greenwood Apartment rent was debited from your bank.
                      </li>
                      <li>
                        <input type="checkbox" style={{ marginRight: '8px' }} />
                        <strong>Draft Dispute Reply:</strong> Prepare response stating payment timeline or proof.
                      </li>
                      <li>
                        <input type="checkbox" style={{ marginRight: '8px' }} />
                        <strong>Legal Aid Consulting:</strong> Speak to a legal adviser before signing agreements.
                      </li>
                    </ul>

                    {/* Autogenerated Response Draft */}
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold' }}>Autogenerated Response Template</h4>
                      <textarea 
                        readOnly 
                        value="To: Greenwood Property Management Ltd.\nSubject: Reply to Eviction Notice dated July 26, 2026\n\nDear Sir/Madam,\nI am writing in response to your notice dated July 26, 2026. I dispute the claim of rent default. [Insert Payment Transaction ID or Dispute Context here]..."
                        style={{
                          width: '95%',
                          height: '80px',
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
