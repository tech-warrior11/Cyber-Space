import React from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  Flame,
  CheckCircle2,
  Play,
  RotateCcw,
  User
} from 'lucide-react';

export const IncidentTab: React.FC = () => {
  const { incident, executePlaybookStep, assignIncidentLead, setActiveTab, selectAlert, alerts, playSynthBeep } = useSOC();

  const completedStepsCount = incident.steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedStepsCount / incident.steps.length) * 100);

  const responders = [
    'Elena Vance (Lead SOC Analyst - Simulated)',
    'Marcus Thorne (Cloud Security Architect)',
    'Aisha Patel (Incident Response Specialist)',
    'David Kim (Threat Hunting Lead)'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="var(--crimson-critical)" />
              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {incident.id}
              </span>
              <span className={`badge badge-${incident.severity}`}>{incident.severity}</span>
              <span className={`badge ${incident.status === 'resolved' ? 'badge-success' : 'badge-critical'}`}>
                {incident.status === 'resolved' ? 'RESOLVED' : 'ACTIVE MITIGATION'}
              </span>
            </div>
            <h2 style={{ fontSize: '18px', color: '#ffffff', marginTop: '6px' }}>
              {incident.title}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '800px' }}>
              {incident.summary}
            </p>
          </div>

          {/* Lead Responder Selector */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', minWidth: '240px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} color="var(--cyan-primary)" /> Lead Responder:
            </div>
            <select
              value={incident.leadResponder}
              onChange={e => assignIncidentLead(e.target.value)}
              className="select-control"
              style={{ width: '100%', marginTop: '6px', fontSize: '12px' }}
            >
              {responders.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Correlated Entities */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', fontSize: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-medium)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Affected Assets:</span>
            {incident.affectedAssets.map((asset, i) => (
              <span key={i} className="mono badge badge-info" style={{ color: 'var(--cyan-primary)' }}>
                {asset}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Associated Alerts:</span>
            {incident.associatedAlerts.map((aid, i) => (
              <button
                key={i}
                onClick={() => {
                  const target = alerts.find(a => a.id === aid);
                  if (target) {
                    selectAlert(target);
                    setActiveTab('threats');
                  }
                }}
                className="badge badge-critical mono"
                style={{ cursor: 'pointer', border: '1px solid rgba(244,63,94,0.4)' }}
              >
                {aid} ↗
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Playbook Progress Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
              {incident.playbookName}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '10px' }}>
              ({completedStepsCount} of {incident.steps.length} Steps Executed)
            </span>
          </div>
          <span className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cyan-primary)' }}>
            {progressPercent}% Complete
          </span>
        </div>

        <div style={{ height: '8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent === 100 ? 'var(--emerald-success)' : 'var(--cyan-primary)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Guided Playbook Interactive Timeline */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px' }}>Automated Playbook Execution Pipeline</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Execute simulated containment workflows safely in browser memory. Actions directly update host isolation and alert resolution status.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {incident.steps.map((step, index) => {
            const isDone = step.completed;

            return (
              <div
                key={step.id}
                style={{
                  background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-medium)'}`,
                  borderRadius: '8px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                  <div style={{ marginTop: '2px' }}>
                    {isDone ? (
                      <CheckCircle2 size={20} color="var(--emerald-success)" />
                    ) : (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid var(--border-highlight)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--text-muted)'
                        }}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: isDone ? 'var(--emerald-success)' : '#ffffff' }}>
                        {step.label}
                      </span>
                      {isDone && (
                        <span className="badge badge-success mono" style={{ fontSize: '9px' }}>
                          EXECUTED {step.completedAt}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {step.description}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      executePlaybookStep(step.id);
                      playSynthBeep(isDone ? 'click' : 'success');
                    }}
                    className={`btn btn-sm ${isDone ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ minWidth: '170px' }}
                  >
                    {isDone ? <RotateCcw size={13} /> : <Play size={13} />}
                    <span>{isDone ? 'Revert Action' : step.actionText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
