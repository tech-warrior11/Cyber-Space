import React from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  KeyRound,
  ShieldCheck,
  UserCheck,
  Smartphone,
  AlertTriangle,
  Lock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const IdentityTab: React.FC = () => {
  const { zeroTrust, toggleZeroTrustRule, postureScore } = useSOC();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tab Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={20} color="var(--indigo-accent)" />
              <h2 style={{ fontSize: '18px' }}>Identity & Zero-Trust Architecture Posture</h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Evaluates continuous verification, least-privilege cloud roles, and biometric credential enforcement.
            </p>
          </div>

          <span className="badge badge-info mono">
            ZERO-TRUST LEVEL 3 (ADVANCED)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {/* MFA Adoption */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                MFA Coverage
              </span>
              <Smartphone size={16} color="var(--emerald-success)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
              <span className="mono" style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff' }}>
                {zeroTrust.mfaAdoptionRate}%
              </span>
              <span className="badge badge-success">Phishing Resistant</span>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: '6px' }}>
            <strong>What this means:</strong> 94.8% of user identities enforce FIDO2 WebAuthn keys. 5.2% legacy machine credentials are scoped for Q4 deprecation.
          </div>
        </div>

        {/* Standing Privileges */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Privileged Cloud Accounts
              </span>
              <UserCheck size={16} color="var(--amber-warning)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
              <span className="mono" style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff' }}>
                {zeroTrust.privilegedAccounts}
              </span>
              <span className="badge badge-warning">Zero Permanent Root</span>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: '6px' }}>
            <strong>What this means:</strong> High-privilege permissions require ephemeral Just-In-Time (JIT) elevation with multi-party approval and automated 60m session expiry.
          </div>
        </div>

        {/* Active Machine Principals */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Service Principals
              </span>
              <Lock size={16} color="var(--cyan-primary)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
              <span className="mono" style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff' }}>
                {zeroTrust.servicePrincipals}
              </span>
              <span className="badge badge-info">100% Rotated &lt; 90d</span>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: '6px' }}>
            <strong>What this means:</strong> Non-human workload identities (Kubernetes service accounts, Terraform deployers) utilizing automated Vault secrets rotation.
          </div>
        </div>

        {/* Session Anomalies */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Anomalous Sessions
              </span>
              <AlertTriangle size={16} color="var(--crimson-critical)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
              <span className="mono" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--crimson-critical)' }}>
                {zeroTrust.anomalousSessions}
              </span>
              <span className="badge badge-critical">Active Risk</span>
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '10px', borderRadius: '6px' }}>
            <strong>What this means:</strong> Unusual geographic speed or unrecognized ASNs detected (linked directly to the active simulated incident scenario).
          </div>
        </div>
      </div>

      {/* Interactive Conditional Access Policy Engine */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '15px' }}>Zero-Trust Conditional Access Policy Enforcement</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Interactive demo policy gatekeeper. Toggle rules to simulate dynamic changes to the enterprise security posture score.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Computed Posture:</span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--cyan-primary)' }}>{postureScore}/100</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {zeroTrust.conditionalAccessRules.map(rule => (
            <div
              key={rule.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '260px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: rule.enabled ? 'var(--emerald-dim)' : 'rgba(148, 163, 184, 0.1)'
                  }}
                >
                  <ShieldCheck
                    size={18}
                    color={rule.enabled ? 'var(--emerald-success)' : 'var(--text-muted)'}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>
                      {rule.name}
                    </span>
                    <span className={`badge ${rule.enabled ? 'badge-success' : 'badge-info'}`}>
                      {rule.enabled ? 'ENFORCED' : 'DISABLED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {rule.description}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--cyan-hover)', marginTop: '4px' }}>
                    Impact: {rule.impact}
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => toggleZeroTrustRule(rule.id)}
                  className={`btn btn-sm ${rule.enabled ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '110px' }}
                >
                  {rule.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  <span>{rule.enabled ? 'Enforced' : 'Enable Rule'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
