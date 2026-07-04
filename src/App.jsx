import React, { useState, useEffect } from 'react';
import { PhoneCall, Settings, Server, RefreshCw, VolumeX, Radio } from 'lucide-react';
import CallForm from './components/CallForm';
import CallHistory from './components/CallHistory';
import LiveTranscript from './components/LiveTranscript';

export default function App() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCallSid, setActiveCallSid] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [backendUrl, setBackendUrl] = useState(localStorage.getItem('backend_url') || 'https://farmer-twilio-bot.onrender.com');

  // Helper to resolve API URLs
  const getApiUrl = (path) => {
    if (backendUrl) {
      const cleanUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      return `${cleanUrl}${path}`;
    }
    return path;
  };

  // Save backend URL to local storage
  const handleSaveSettings = (url) => {
    const trimmed = url.trim();
    setBackendUrl(trimmed);
    localStorage.setItem('backend_url', trimmed);
    setShowSettings(false);
  };

  // Fetch all calls
  const fetchCalls = async () => {
    try {
      const res = await fetch(getApiUrl('/calls'));
      if (res.ok) {
        const data = await res.json();
        setCalls(data.calls || []);
      }
    } catch (err) {
      console.error('Error fetching calls:', err);
    }
  };

  // Fetch transcript for selected call
  const fetchTranscript = async (sid) => {
    if (!sid) return;
    try {
      const res = await fetch(getApiUrl(`/transcript/${sid}`));
      if (res.ok) {
        const data = await res.json();
        setTranscript(data.transcript || []);

        // Check if the call has ended to stop fast polling
        const hasEnded = (data.transcript || []).some(
          (entry) => entry.type === 'call_end' || entry.type === 'error'
        );
        if (hasEnded && activeCallSid === sid) {
          setActiveCallSid(null);
        }
      }
    } catch (err) {
      console.error('Error fetching transcript:', err);
    }
  };

  // Initiate call
  const handleInitiateCall = async (name, phone) => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('/initiate-call'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          farmer_name: name,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success' && result.call_sid) {
          // Set as active and selected
          const newCallObj = {
            call_sid: result.call_sid,
            farmer_name: result.farmer_name,
            transcript_count: 1,
          };
          
          setActiveCallSid(result.call_sid);
          setSelectedCall(newCallObj);
          setTranscript([]); // Clear previous transcript
          
          // Refresh calls list
          await fetchCalls();
        } else {
          alert(`Failed to start call: ${result.message || 'Unknown error'}`);
        }
      } else {
        alert('Server returned an error initiating the call.');
      }
    } catch (err) {
      console.error('Error initiating call:', err);
      alert('Could not connect to the backend server. Make sure it is running and CORS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  // Polling for recent calls list (every 5 seconds)
  useEffect(() => {
    fetchCalls();
    const interval = setInterval(fetchCalls, 5000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  // Polling for active transcript (every 2 seconds)
  useEffect(() => {
    if (!selectedCall) return;

    fetchTranscript(selectedCall.call_sid);

    // Only set up interval if the call is active
    const isCurrentlyActive = activeCallSid === selectedCall.call_sid || 
      !transcript.some(e => e.type === 'call_end' || e.type === 'error');

    if (isCurrentlyActive) {
      const interval = setInterval(() => {
        fetchTranscript(selectedCall.call_sid);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedCall, activeCallSid, backendUrl]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <header style={{
        padding: '16px 24px',
        background: 'rgba(18, 22, 35, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <Radio size={22} color="#fff" style={{ animation: 'pulse 2s infinite' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Sunita AI Farmer Scheme Bot
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-card)',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
          {/* Settings Panel Modal-overlay inside sidebar if open */}
          {showSettings && (
            <div className="glass-panel glow-cyan" style={{ padding: '20px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={16} color="var(--accent-secondary)" />
                Backend Configuration
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                If your backend is running on a different domain or an ngrok tunnel, paste the full URL here. Leave empty to use relative proxy.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g., https://your-ngrok.ngrok-free.dev"
                  defaultValue={backendUrl}
                  id="settings-url-input"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const input = document.getElementById('settings-url-input');
                      handleSaveSettings(input.value);
                    }}
                    style={{
                      flex: 1,
                      background: 'var(--accent-secondary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Save URL
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-card)',
                      color: '#fff',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <CallForm onInitiateCall={handleInitiateCall} loading={loading} />
          
          <CallHistory
            calls={calls}
            selectedCallSid={selectedCall?.call_sid}
            onSelectCall={(call) => {
              setSelectedCall(call);
              setTranscript([]); // clear while loading
              fetchTranscript(call.call_sid);
            }}
            activeCallSid={activeCallSid}
          />
        </div>

        {/* Transcript Panel */}
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <LiveTranscript
            call={selectedCall}
            transcript={transcript}
            polling={activeCallSid === selectedCall?.call_sid}
            onRefresh={() => fetchTranscript(selectedCall?.call_sid)}
          />
        </div>
      </main>
    </div>
  );
}
