import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  CheckCircle2,
  AlertCircle,
  Search,
  CheckCircle
} from 'lucide-react';

export const ComplianceTab: React.FC = () => {
  const { complianceControls, filterFramework, setFilterFramework, playSynthBeep } = useSOC();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredControls = complianceControls.filter(ctrl => {
    const matchesFramework = filterFramework === 'All' || ctrl.framework === filterFramework;
    const matchesCategory = categoryFilter === 'all' || ctrl.category === categoryFilter;
    const matchesSearch =
      ctrl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFramework && matchesCategory && matchesSearch;
  });

  const compliantCount = complianceControls.filter(c => c.status === 'compliant').length;
  const reviewCount = complianceControls.filter(c => c.status === 'needs_review').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Disclaimer */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="var(--emerald-success)" />
              <h2 style={{ fontSize: '18px' }}>Continuous Compliance & Control Coverage</h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Real-time mapping of synthetic security telemetry against industry standard governance benchmarks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-warning mono">ILLUSTRATIVE COMPLIANCE ONLY</span>
          </div>
        </div>

        {/* Framework and Category Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search control code or keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <select
            value={filterFramework}
            onChange={e => {
              setFilterFramework(e.target.value);
              playSynthBeep('click');
            }}
            className="select-control"
          >
            <option value="All">All Frameworks</option>
            <option value="NIST CSF 2.0">NIST CSF 2.0</option>
            <option value="SOC 2 Type II">SOC 2 Type II</option>
            <option value="ISO 27001:2022">ISO 27001:2022</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Control Functions</option>
            <option value="Identify">Identify</option>
            <option value="Protect">Protect</option>
            <option value="Detect">Detect</option>
            <option value="Respond">Respond</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Control Summary Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '6px', background: 'var(--emerald-dim)' }}>
            <CheckCircle size={18} color="var(--emerald-success)" />
          </div>
          <div>
            <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
              {compliantCount} / {complianceControls.length} Passing
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Automated Proof Verified</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '6px', background: 'var(--amber-dim)' }}>
            <AlertCircle size={18} color="var(--amber-warning)" />
          </div>
          <div>
            <div className="mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--amber-warning)' }}>
              {reviewCount} Under Review
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pending Incident Triage</div>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredControls.map(ctrl => {
          const isCompliant = ctrl.status === 'compliant';

          return (
            <div
              key={ctrl.id}
              className="glass-panel"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-info mono">{ctrl.framework}</span>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--cyan-primary)', fontSize: '13px' }}>
                      {ctrl.code}
                    </span>
                    <span className="badge badge-info">{ctrl.category}</span>
                  </div>
                  <h3 style={{ fontSize: '14px', color: '#ffffff', marginTop: '6px' }}>
                    {ctrl.title}
                  </h3>
                </div>

                <div>
                  {isCompliant ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> COMPLIANT
                    </span>
                  ) : (
                    <span className="badge badge-high" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> NEEDS REVIEW
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ctrl.description}
              </p>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Simulated Audit Evidence: </span>
                  <span style={{ color: 'var(--text-main)' }}>{ctrl.simulatedEvidence}</span>
                </div>
                <div className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Last Audited: {ctrl.lastAudited}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
