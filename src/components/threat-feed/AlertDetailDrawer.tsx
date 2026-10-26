import React from 'react';
import { useSOC } from '../../context/SOCContext';
import type { ThreatAlert } from '../../types';
import {
  X,
  ShieldAlert,
  Clock,
  Crosshair,
  CheckCircle,
  Play,
  ExternalLink,
  Shield
} from 'lucide-react';

interface AlertDetailDrawerProps {
  alert: ThreatAlert;
  onClose: () => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({ alert, onClose }) => {
  const { updateAlertStatus, selectAsset, assets, setActiveTab, playSynthBeep } = useSOC();

  const handleInspectAsset = () => {
    const found = assets.find(a => a.id === alert.targetAssetId || a.name === alert.targetAsset);
    if (found) {
      selectAsset(found);
      setActiveTab('assets');
      onClose();
    }
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-content" style={{ padding: '24px' }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-medium)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: alert.severity === 'critical' ? 'var(--crimson-dim)' : 'var(--amber-dim)'
              }}
            >
              <ShieldAlert
                size={20}
                color={alert.severity === 'critical' ? 'var(--crimson-critical)' : 'var(--amber-warning)'}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {alert.id}
                </span>
                <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                <span className="badge badge-info mono">{alert.confidence}% Confidence</span>
              </div>
              <h2 style={{ fontSize: '16px', color: '#ffffff', marginTop: '4px' }}>
                {alert.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Simulated Disclaimer Banner */}
        <div
          style={{
            margin: '16px 0',
            padding: '10px 14px',
            borderRadius: '6px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '11px',
            color: '#fbbf24'
          }}
        >
          <Shield size={16} />
          <span>SIMULATED ALERT // IOCs use RFC 5737 demo ranges and synthetic signatures</span>
        </div>

        {/* Alert Summary & Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <div>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Summary & Impact
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {alert.summary}
            </p>
          </div>

          {/* MITRE ATT&CK Matrix Tag */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              MITRE ATT&CK Framework Mapping
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info mono">{alert.mitreId}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cyan-primary)' }}>
                {alert.mitreTechnique}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Tactic: {alert.mitreTactic}
            </div>
          </div>

          {/* Target & Source Specifications */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Asset</div>
              <div className="mono" style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', marginTop: '4px', wordBreak: 'break-all' }}>
                {alert.targetAsset}
              </div>
              <button
                onClick={handleInspectAsset}
                className="btn btn-outline btn-sm"
                style={{ marginTop: '8px', width: '100%', fontSize: '11px', padding: '3px 6px' }}
              >
                <ExternalLink size={11} /> Locate Asset
              </button>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-medium)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Source / Actor</div>
              <div className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--crimson-critical)', marginTop: '4px' }}>
                {alert.sourceIp}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                RFC 5737 Test Net
              </div>
            </div>
          </div>

          {/* Indicators of Compromise (IOCs) */}
          <div>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Synthetic Indicators of Compromise (IOCs)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {alert.iocList.map((ioc, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}
                >
                  <span className="badge badge-info mono" style={{ fontSize: '10px' }}>
                    {ioc.type}
                  </span>
                  <span className="mono" style={{ color: 'var(--cyan-hover)', wordBreak: 'break-all', maxWidth: '360px' }}>
                    {ioc.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <div>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Forensic Event Sequence
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '2px solid var(--border-highlight)', paddingLeft: '14px', marginLeft: '6px' }}>
              {alert.timeline.map((item, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-19px',
                      top: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--cyan-primary)'
                    }}
                  />
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {item.time}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Playbook */}
          <div style={{ background: 'var(--cyan-dim)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '6px', padding: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--cyan-primary)', fontWeight: 600 }}>
              Recommended Response Playbook
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
              {alert.recommendedPlaybook}
            </div>
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-medium)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => updateAlertStatus(alert.id, 'investigating')}
            className={`btn btn-sm ${alert.status === 'investigating' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Clock size={13} />
            <span>Investigating</span>
          </button>
          <button
            onClick={() => updateAlertStatus(alert.id, 'contained')}
            className={`btn btn-sm ${alert.status === 'contained' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Crosshair size={13} />
            <span>Mark Contained</span>
          </button>
          <button
            onClick={() => updateAlertStatus(alert.id, 'resolved')}
            className={`btn btn-sm ${alert.status === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <CheckCircle size={13} />
            <span>Resolve</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('incident');
              onClose();
              playSynthBeep('click');
            }}
            className="btn btn-primary btn-sm"
            style={{ marginLeft: 'auto' }}
          >
            <Play size={13} />
            <span>Launch Playbook</span>
          </button>
        </div>
      </div>
    </>
  );
};
