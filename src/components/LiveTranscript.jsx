import React, { useEffect, useRef } from 'react';
import { Bot, User, RefreshCw, Volume2, ShieldAlert } from 'lucide-react';

export default function LiveTranscript({ call, transcript, polling, onRefresh }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom whenever transcript changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  if (!call) {
    return (
      <div className="glass-panel" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        padding: '40px',
        textAlign: 'center',
        gap: '16px'
      }}>
        <Volume2 size={48} style={{ opacity: 0.2, animation: 'float 4s ease-in-out infinite' }} />
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No Call Selected</h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
            Select a call from the history or start a new call to view the live transcript.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.01)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{call.farmer_name}</h3>
            {polling && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  animation: 'ring-pulse 1.5s infinite'
                }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                  Active Polling
                </span>
              </div>
            )}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Call SID: {call.call_sid}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={polling}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-card)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--border-card)';
          }}
        >
          <RefreshCw size={14} className={polling ? 'spin-anim' : ''} />
          Refresh
        </button>
      </div>

      {/* Transcript List */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        background: 'rgba(10, 13, 20, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {transcript.length === 0 ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            Connecting connection... Waiting for transcript data.
          </div>
        ) : (
          transcript.map((entry, index) => {
            if (entry.speaker === 'system') {
              let styleObj = {
                alignSelf: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderRadius: '12px',
                maxWidth: '80%',
                textAlign: 'center',
                animation: 'fadeIn 0.3s ease-out'
              };

              // Customize colors for end or errors
              if (entry.type === 'call_end') {
                styleObj.color = 'var(--text-muted)';
              } else if (entry.type === 'error') {
                styleObj.background = 'rgba(239, 68, 68, 0.05)';
                styleObj.border = '1px solid rgba(239, 68, 68, 0.15)';
                styleObj.color = 'var(--accent-danger)';
              }

              return (
                <div key={index} style={styleObj}>
                  {entry.text}
                </div>
              );
            }

            const isBot = entry.speaker === 'bot';

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '75%',
                  flexDirection: isBot ? 'row' : 'row-reverse',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isBot ? 'var(--accent-primary-glow)' : 'var(--accent-secondary-glow)',
                  border: `1px solid ${isBot ? 'var(--accent-primary)' : 'var(--accent-secondary)'}`,
                  color: isBot ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                  flexShrink: 0
                }}>
                  {isBot ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Bubble */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    padding: '0 4px'
                  }}>
                    {isBot ? 'वाणी (AI Bot)' : call.farmer_name}
                  </div>
                  <div style={{
                    background: isBot ? 'rgba(16, 185, 129, 0.08)' : 'rgba(6, 182, 212, 0.08)',
                    border: `1px solid ${isBot ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)'}`,
                    color: 'var(--text-primary)',
                    padding: '12px 16px',
                    borderRadius: isBot ? '0 16px 16px 16px' : '16px 0 16px 16px',
                    fontSize: '0.92rem',
                    lineHeight: '1.45',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {entry.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
