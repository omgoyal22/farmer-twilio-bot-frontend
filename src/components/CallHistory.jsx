import React from 'react';
import { History, Phone, MessageSquare, ChevronRight } from 'lucide-react';

export default function CallHistory({ calls, selectedCallSid, onSelectCall, activeCallSid }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <History size={20} color="var(--accent-secondary)" />
        Recent Calls
      </h2>

      {calls.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          padding: '40px 0',
          textAlign: 'center',
          gap: '12px'
        }}>
          <Phone size={32} style={{ opacity: 0.3 }} />
          <p style={{ fontSize: '0.9rem' }}>No calls initiated yet.</p>
        </div>
      ) : (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '4px'
        }}>
          {calls.map((call) => {
            const isSelected = selectedCallSid === call.call_sid;
            const isActive = activeCallSid === call.call_sid;

            return (
              <div
                key={call.call_sid}
                onClick={() => onSelectCall(call)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                  borderRadius: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '8px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    animation: 'ring-pulse 1.5s infinite'
                  }} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: isActive ? '8px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                      {call.farmer_name}
                    </span>
                    {isActive && (
                      <span style={{
                        fontSize: '0.7rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-primary)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 500
                      }}>
                        Live
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    SID: {call.call_sid.substring(0, 10)}...
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={14} />
                    <span>{call.transcript_count || 0}</span>
                  </div>
                  <ChevronRight size={16} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
