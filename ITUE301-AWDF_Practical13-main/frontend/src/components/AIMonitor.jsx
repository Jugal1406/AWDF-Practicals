import React, { useState } from 'react';
import { generateAIDescription } from '../api';

export default function AIMonitor({ onApplySuggestion }) {
  const [testPrompt, setTestPrompt] = useState('Build JWT Authentication Pipeline');
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState(null);
  const [error, setError] = useState(null);

  const sampleTitles = [
    'Design MongoDB Schema with Mongoose Validation',
    'Containerize Full-Stack App with Docker Compose',
    'Set up GitHub Actions CI Pipeline with Jest',
    'Fix memory leak in background event listener',
  ];

  const handleTestGenerate = async (titleToUse) => {
    const title = titleToUse || testPrompt;
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateAIDescription(title);
      setAiOutput(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-monitor-card" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
      border: '1px solid rgba(244, 63, 94, 0.35)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
      color: '#f8fafc',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
          }}>
            🤖
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fb7185' }}>
              Practical 13: AI API Integration (Google Gemini)
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Secure server-side API proxy, graceful degradation heuristics, and responsible AI governance
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#fb7185',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            fontWeight: 600,
          }}>
            Backend Proxy: Protected (.env)
          </span>
          <span style={{
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#4ade80',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            fontWeight: 600,
          }}>
            Graceful Degradation: Active
          </span>
        </div>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {/* Pillar 1: Backend Security */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          borderTop: '3px solid #f43f5e',
        }}>
          <div style={{ fontWeight: 700, color: '#fca5a5', marginBottom: '6px', fontSize: '0.95rem' }}>
            🔒 Server-Side Key Isolation
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            <code>GEMINI_API_KEY</code> is kept strictly in <code>backend/.env</code> and never sent to the browser or bundled in frontend client chunks. Frontend talks only to <code>POST /api/ai/generate-description</code>.
          </div>
        </div>

        {/* Pillar 2: Graceful Degradation */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          borderTop: '3px solid #38bdf8',
        }}>
          <div style={{ fontWeight: 700, color: '#7dd3fc', marginBottom: '6px', fontSize: '0.95rem' }}>
            🛡️ Graceful Degradation
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            If the Gemini API key is unconfigured, times out, or hits rate/quota limits, the backend catches the error and generates an intelligent offline template so task creation never crashes.
          </div>
        </div>

        {/* Pillar 3: Responsible AI */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          borderTop: '3px solid #a855f7',
        }}>
          <div style={{ fontWeight: 700, color: '#d8b4fe', marginBottom: '6px', fontSize: '0.95rem' }}>
            ⚖️ Responsible AI &amp; Privacy
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
            Only non-sensitive task titles are sent to the model. Personal identifiable information (PII), passwords, and tokens are scrubbed. Suggestions remain fully editable by the user.
          </div>
        </div>
      </div>

      {/* Interactive Quick-Test Sandbox */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px dashed rgba(244, 63, 94, 0.3)',
      }}>
        <div style={{ fontWeight: 600, color: '#fb7185', marginBottom: '10px', fontSize: '0.9rem' }}>
          🧪 Test AI Generation Engine (Live Sandbox):
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {sampleTitles.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTestPrompt(t);
                handleTestGenerate(t);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              "{t}"
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Type task title to test AI generation..."
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f8fafc',
              fontSize: '0.85rem',
            }}
          />
          <button
            onClick={() => handleTestGenerate()}
            disabled={loading || !testPrompt.trim()}
            style={{
              background: loading ? 'rgba(244, 63, 94, 0.4)' : '#e11d48',
              border: 'none',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳ Generating...' : '✨ Generate with Gemini AI'}
          </button>
        </div>

        {/* Live Output Card */}
        {aiOutput && (
          <div style={{
            marginTop: '16px',
            background: aiOutput.fallback ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${aiOutput.fallback ? 'rgba(234, 179, 8, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
            borderRadius: '10px',
            padding: '14px',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: aiOutput.fallback ? '#facc15' : '#4ade80' }}>
                {aiOutput.fallback ? '🛡️ Fallback Template Result (Graceful Degradation)' : '✨ Gemini AI Response Received'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Provider: <strong>{aiOutput.provider}</strong>
              </span>
            </div>

            <p style={{ margin: '0 0 8px', color: '#f1f5f9', lineHeight: '1.5' }}>
              <strong>Description:</strong> {aiOutput.description}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <span>Suggested Priority: <strong style={{ color: '#fb7185' }}>{aiOutput.suggestedPriority?.toUpperCase()}</strong></span>
              <span>Estimated Duration: <strong>{aiOutput.estimatedTime || 'N/A'}</strong></span>
            </div>

            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: '#fca5a5' }}>
              ⚠️ <strong>Disclaimer:</strong> {aiOutput.disclaimer}
            </div>

            {onApplySuggestion && (
              <button
                onClick={() => onApplySuggestion(aiOutput.description, aiOutput.suggestedPriority)}
                style={{
                  marginTop: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Apply this suggestion to Task Form ↙
              </button>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: '12px', color: '#f87171', fontSize: '0.82rem' }}>
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}
