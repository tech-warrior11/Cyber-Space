import React, { useState, useEffect } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  Shield,
  Radio,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Info,
  ChevronDown,
  Activity
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    scenarios,
    activeScenario,
    loadScenario,
    eventsPerSecond,
    resetAllData,
    startTour,
    soundEnabled,
    toggleSound,
    isTickerPaused,
    toggleTickerPause
  } = useSOC();

  const [utcTime, setUtcTime] = useState<string>('');
  const [showScenarioMenu, setShowScenarioMenu] = useState<boolean>(false);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        {/* Brand & Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.15) 100%)',
                border: '1px solid var(--cyan-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(6,182,212,0.3)'
              }}
            >
              <Shield size={20} color="var(--cyan-primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.05em', color: '#ffffff' }}>
                  CYBER <span style={{ color: 'var(--cyan-primary)' }}>SPACE</span>
                </span>
                <span
                  className="badge badge-info mono"
                  style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(6,182,212,0.1)', color: 'var(--cyan-primary)' }}
                >
                  SOC v4.2
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Autonomous Cyber Defense Center
              </div>
            </div>
          </div>

          {/* Safety Notice Pill */}
          <button
            onClick={() => setShowSafetyModal(true)}
            className="btn btn-outline btn-sm"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.4)',
              background: 'rgba(245, 158, 11, 0.08)',
              color: '#fbbf24',
              fontSize: '11px',
              padding: '4px 10px'
            }}
            title="Click to view educational simulation safety disclosure"
          >
            <Info size={13} />
            <span>SIMULATED DEMO // SYNTHETIC DATA</span>
          </button>
        </div>

        {/* Live Telemetry Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Current Telemetry Clock">
            <span className="pulsing-dot pulse-success"></span>
            <span className="mono" style={{ color: 'var(--text-secondary)' }}>
              {utcTime || 'SYNCHRONIZING...'}
            </span>
          </div>
          <div style={{ width: '1px', height: '14px', background: 'var(--border-medium)' }}></div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            onClick={toggleTickerPause}
            title={isTickerPaused ? 'Telemetry paused. Click to resume' : 'Click to pause synthetic telemetry flow'}
          >
            <Activity size={13} color="var(--cyan-primary)" />
            <span className="mono" style={{ color: isTickerPaused ? 'var(--amber-warning)' : 'var(--cyan-primary)', fontWeight: 600 }}>
              {isTickerPaused ? 'PAUSED' : `${eventsPerSecond} EPS`}
            </span>
          </div>
        </div>

        {/* Actions & Scenario Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="header-actions">
          {/* Scenario Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowScenarioMenu(!showScenarioMenu)}
              className="btn btn-secondary btn-sm"
              style={{ border: '1px solid var(--border-highlight)' }}
              title="Switch demo scenarios"
            >
              <Radio size={14} color="var(--cyan-primary)" />
              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeScenario.badge}
              </span>
              <ChevronDown size={14} />
            </button>

            {showScenarioMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  width: '320px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  padding: '8px'
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Select Guided Scenario
                </div>
                {scenarios.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      loadScenario(sc.id);
                      setShowScenarioMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: sc.id === activeScenario.id ? 'var(--cyan-dim)' : 'transparent',
                      border: sc.id === activeScenario.id ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
                      color: sc.id === activeScenario.id ? 'var(--cyan-primary)' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '12px' }}>{sc.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {sc.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tour Button */}
          <button
            onClick={startTour}
            className="btn btn-secondary btn-sm"
            title="Start interactive dashboard walkthrough"
          >
            <Sparkles size={14} color="var(--amber-warning)" />
            <span>Tour</span>
          </button>

          {/* Audio Feedback Toggle */}
          <button
            onClick={toggleSound}
            className="btn btn-secondary btn-sm"
            title={soundEnabled ? 'Disable UI sound synthesizers' : 'Enable client-side synthetic audio cues'}
            style={{ padding: '6px 10px' }}
          >
            {soundEnabled ? <Volume2 size={14} color="var(--emerald-success)" /> : <VolumeX size={14} color="var(--text-muted)" />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetAllData}
            className="btn btn-outline btn-sm"
            title="Reset all demo state to pristine initial simulation baseline"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          {/* GitHub Source Link */}
          <a
            href="https://github.com/tech-warrior11/Cyber-Space"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            title="View Source on GitHub"
            style={{ padding: '6px 10px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </header>

      {/* Safety & Educational Modal */}
      {showSafetyModal && (
        <div className="modal-overlay" onClick={() => setShowSafetyModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Shield size={24} color="var(--amber-warning)" />
              <h3 style={{ fontSize: '18px' }}>Simulated Demo & Safety Disclosure</h3>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>
                <strong>CYBER SPACE</strong> is an educational, portfolio-grade Security Operations Center (SOC) simulation engineered to demonstrate modern cybersecurity telemetry visualization, incident response orchestration, and zero-trust control models.
              </p>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--amber-warning)' }}>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>100% Synthetic Telemetry:</strong> All alerts, assets, CVE findings, and logs are fictional.</li>
                  <li><strong>Documentation IP Ranges:</strong> All IP addresses adhere to IETF RFC 5737 (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) reserved strictly for documentation.</li>
                  <li><strong>Zero Network Requests:</strong> This application executes exclusively in your web browser. No external APIs, databases, telemetry collectors, or remote security services are invoked.</li>
                  <li><strong>Zero Exploitation:</strong> No exploit payloads, scanner tools, or probing capabilities are implemented or generated.</li>
                  <li><strong>Safe Playbook Actions:</strong> Containment and response buttons (such as "Isolate Pod" or "Revoke Session") mutate client-side simulation state only.</li>
                </ul>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                This software is intended solely for educational inspection and portfolio demonstration. It does not certify security posture or protect production systems.
              </p>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSafetyModal(false)} className="btn btn-primary">
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
