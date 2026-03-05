import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const UnityAdminOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aegisLogs, setAegisLogs] = useState<string[]>(['[SYSTEM] Wrench Diagnostic Garage Initialized...']);
  const [contextInput, setContextInput] = useState('');
  const [contextOutput, setContextOutput] = useState('');

  // Listen for the secret entrance (Ctrl+Shift+U)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'U' || e.key === 'u')) {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for Aegis Shield Threat Events
  useEffect(() => {
    const handleAegisThreat = (e: any) => {
      const threatTime = new Date().toLocaleTimeString();
      const detail = e.detail;
      const logMsg = \[\] ?? AEGIS BLOCKED (\): \\;
      setAegisLogs(prev => [logMsg, ...prev].slice(0, 15)); // Keep last 15 logs
    };
    window.addEventListener('AEGIS_THREAT_DETECTED', handleAegisThreat);
    return () => window.removeEventListener('AEGIS_THREAT_DETECTED', handleAegisThreat);
  }, []);

  const handleExcaliburForge = () => {
    if (!contextInput) return;
    try {
      // Stub for the B85+GZIP pipeline we stole. 
      // For the UI, we'll demonstrate the btoa/atob wrapping.
      const encoded = btoa(encodeURIComponent(contextInput));
      setContextOutput(\[EXCALIBUR FORGED]: B64-WRAPPED::\...\);
    } catch(err) {
      setContextOutput(\[FORGE ERROR]: \\);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, width: '100vw', height: '45vh',
      backgroundColor: '#0d0d0d', color: '#00ffcc', zIndex: 999999,
      borderTop: '4px solid #ffcc00', boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
      padding: '20px', fontFamily: '"Courier New", Courier, monospace',
      display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, color: '#ffcc00', textShadow: '0 0 10px rgba(255,204,0,0.5)' }}>
          ??? CHOP SHOP SUPREME <span style={{ color: '#aaa' }}>//</span> <span style={{ color: '#00ffcc' }}>EXCALIBUR QUANTUM ?</span>
        </h2>
        <button onClick={() => setIsOpen(false)} style={{ background: '#222', border: '1px solid #ff3366', color: '#ff3366', padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}>
          [ CLOSE VAULT ]
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
        {/* CHOP SHOP: AEGIS TERMINAL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', padding: '10px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ffcc00' }}>?? Wrench\\'s Aegis Terminal</h3>
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#000', padding: '10px', border: '1px inset #222', color: '#0f0', fontSize: '12px' }}>
            {aegisLogs.map((log, i) => (
              <div key={i} style={{ marginBottom: '4px', color: log.includes('??') ? '#ff3366' : '#0f0' }}>{log}</div>
            ))}
          </div>
          <button style={{ marginTop: '10px', padding: '8px', background: '#333', color: '#fff', border: '1px solid #555', cursor: 'pointer' }} onClick={() => setAegisLogs(['[SYSTEM] Manual Ping: Aegis nodes active.', ...aegisLogs])}>
            Ping Defense Grid
          </button>
        </div>

        {/* EXCALIBUR: CONTEXT FORGE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', padding: '10px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#00ffcc' }}>? Context Forge Engine</h3>
          <textarea 
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Paste raw data or stolen payload here..." 
            style={{ height: '80px', backgroundColor: '#000', color: '#00ffcc', border: '1px solid #222', padding: '10px', resize: 'none', outline: 'none' }}
          />
          <button onClick={handleExcaliburForge} style={{ padding: '10px', background: '#00ffcc', color: '#000', border: 'none', fontWeight: 'bold', margin: '10px 0', cursor: 'pointer' }}>
            ENGAGE OVERDRIVE COMPRESSION
          </button>
          <div style={{ flex: 1, backgroundColor: '#051510', border: '1px solid #005544', padding: '10px', wordBreak: 'break-all', overflowY: 'auto', fontSize: '11px', color: '#77ffdd' }}>
            {contextOutput || 'Awaiting input...'}
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('unity-admin-root');
if (container) {
  const root = createRoot(container);
  root.render(<UnityAdminOverlay />);
}
