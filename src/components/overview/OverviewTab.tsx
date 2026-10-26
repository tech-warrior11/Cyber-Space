import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { MetricsGrid } from './MetricsGrid';
import { ThreatMap } from './ThreatMap';
import { LiveTicker } from './LiveTicker';
import { AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { activeScenario, alerts, selectAlert, setActiveTab, playSynthBeep } = useSOC();

  const highPriorityAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Active Scenario Context Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, rgba(6,182,212,0.12) 0%, rgba(17,26,48,0.7) 100%)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: '8px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: 'var(--cyan-dim)',
              border: '1px solid var(--cyan-primary)'
            }}
          >
            <Sparkles size={18} color="var(--cyan-primary)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                {activeScenario.name}
              </span>
              <span className="badge badge-info">{activeScenario.badge}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {activeScenario.contextBanner}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-warning mono" style={{ fontSize: '10px' }}>
            SIMULATED INCIDENT ACTIVE
          </span>
        </div>
      </div>

      {/* Live Telemetry Ticker */}
      <LiveTicker />

      {/* Primary Metrics Grid */}
      <MetricsGrid />

      {/* Interactive Global Threat Map */}
      <ThreatMap />

      {/* Recent High Priority Events Triage Section */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px' }}>High-Priority Triage Queue</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Top alerts requiring immediate simulated forensic evaluation and containment action.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab('threats');
              playSynthBeep('click');
            }}
            className="btn btn-secondary btn-sm"
          >
            <span>View All ({alerts.length}) Alerts</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {highPriorityAlerts.map(alert => (
            <div
              key={alert.id}
              onClick={() => {
                selectAlert(alert);
                setActiveTab('threats');
                playSynthBeep('click');
              }}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: '6px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cyan-primary)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: alert.severity === 'critical' ? 'var(--crimson-dim)' : 'var(--amber-dim)'
                  }}
                >
                  <AlertTriangle
                    size={16}
                    color={alert.severity === 'critical' ? 'var(--crimson-critical)' : 'var(--amber-warning)'}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {alert.id}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>
                      {alert.title}
                    </span>
                    <span className={`badge badge-${alert.severity}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    Target: <span className="mono" style={{ color: 'var(--cyan-primary)' }}>{alert.targetAsset}</span> • Source:{' '}
                    <span className="mono">{alert.sourceIp}</span> • Technique: <span>{alert.mitreTechnique}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {alert.timestamp}
                </span>
                <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                  {alert.status}
                </span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
