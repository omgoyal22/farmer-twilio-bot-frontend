import React, { useState } from 'react';
import { PhoneCall, User, Phone, AlertCircle } from 'lucide-react';

export default function CallForm({ onInitiateCall, loading }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Farmer name is required');
      return;
    }

    // Basic phone number validation (+ followed by digits)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('Enter a valid phone number with country code (e.g., +919876543210)');
      return;
    }

    onInitiateCall(name.trim(), cleanPhone);
  };

  return (
    <div className="glass-panel glow-emerald" style={{ padding: '24px', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PhoneCall size={20} color="var(--accent-primary)" />
        Start New Call
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--accent-danger)',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} /> Farmer Name
          </label>
          <input
            type="text"
            placeholder="e.g., Ramesh Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-card)',
              borderRadius: '8px',
              padding: '10px 12px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-card)'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={14} /> Phone Number (with Country Code)
          </label>
          <input
            type="text"
            placeholder="e.g., +919876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-card)',
              borderRadius: '8px',
              padding: '10px 12px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-card)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.2)',
            animation: loading ? 'ring-pulse 2s infinite' : 'none'
          }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Initiating Call...
            </>
          ) : (
            <>
              <PhoneCall size={18} />
              Call Farmer
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
