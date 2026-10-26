import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { PostureGauge } from '../common/PostureGauge';
import {
  ShieldAlert,
  Clock,
  Server,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const {
    postureScore,
    mttrMinutes,
    alerts,
    assets,
    setActiveTab,
    playSynthBeep
  } = useSOC();

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const highCount = alerts.filter(a => a.severity === 'high' && a.status === 'active').length;
  const mediumCount = alerts.filter(a => a.severity === 'medium' && a.status === 'active').length;
  const lowCount = alerts.filter(a => a.severity === 'low' || a.status === 'resolved').length;
  const totalAlerts = alerts.length;

  const isolatedAssets = assets.filter(a => a.status === 'isolated').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
      {/* 1. Posture Score Card */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <PostureGauge score={postureScore} size={160} label="Security Score" sublabel="Index (0-100)" />
        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Dynamic synthetic score evaluating active threats, Zero-Trust compliance, and container telemetry.
        </div>
      </div>

      {/* 2. Open Threat Alerts */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Open Threat Alerts
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', background: 'var(--crimson-dim)' }}>
              <ShieldAlert size={16} color="var(--crimson-critical)" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '12px' }}>
            <span className="mono" style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>
              {criticalCount + highCount}
            </span>
            <span className="badge badge-critical">
              {criticalCount} CRITICAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            {/* Severity Mini-Bar */}
            <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ width: `${(criticalCount / totalAlerts) * 100}%`, background: 'var(--crimson-critical)' }} title="Critical" />
              <div style={{ width: `${(highCount / totalAlerts) * 100}%`, background: 'var(--amber-warning)' }} title="High" />
              <div style={{ width: `${(mediumCount / totalAlerts) * 100}%`, background: 'var(--cyan-primary)' }} title="Medium" />
              <div style={{ width: `${(lowCount / totalAlerts) * 100}%`, background: 'var(--emerald-success)' }} title="Low/Resolved" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>{criticalCount} Critical</span>
              <span>{highCount} High</span>
              <span>{mediumCount} Med</span>
              <span>{lowCount} Low</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('threats');
            playSynthBeep('click');
          }}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', marginTop: '14px', justifyContent: 'space-between' }}
        >
          <span>Investigate Threat Queue</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 3. Simulated MTTR */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simulated MTTR
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', background: 'var(--cyan-dim)' }}>
              <Clock size={16} color="var(--cyan-primary)" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '12px' }}>
            <span className="mono" style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>
              {mttrMinutes}m
            </span>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <TrendingDown size={11} /> -3.2m
            </span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '14px' }}>
            Mean Time to Respond based on automated containment playbooks and simulated analyst triage velocity.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('incident');
            playSynthBeep('click');
          }}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', marginTop: '14px', justifyContent: 'space-between' }}
        >
          <span>Open Active Playbooks</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 4. Asset Fleet Health */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monitored Assets
            </span>
            <div style={{ padding: '6px', borderRadius: '6px', background: 'var(--emerald-dim)' }}>
              <Server size={16} color="var(--emerald-success)" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '12px' }}>
            <span className="mono" style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>
              128
            </span>
            <span className="badge badge-info">
              {assets.length} In-Focus Demo Nodes
            </span>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} color="var(--emerald-success)" /> Healthy
              </span>
              <strong className="mono" style={{ color: 'var(--emerald-success)' }}>{assets.length - isolatedAssets}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={13} color="var(--amber-warning)" /> Isolated / Quarantined
              </span>
              <strong className="mono" style={{ color: 'var(--amber-warning)' }}>{isolatedAssets}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('assets');
            playSynthBeep('click');
          }}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', marginTop: '14px', justifyContent: 'space-between' }}
        >
          <span>View Asset Inventory</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
