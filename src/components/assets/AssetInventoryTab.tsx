import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  Server,
  Search,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  X
} from 'lucide-react';

export const AssetInventoryTab: React.FC = () => {
  const { assets, selectedAsset, selectAsset, toggleAssetIsolation, playSynthBeep } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEnv = envFilter === 'all' || asset.environment === envFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesEnv && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} color="var(--cyan-primary)" />
              <h2 style={{ fontSize: '18px' }}>Asset Inventory & Attack Surface Posture</h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Fictional inventory covering cloud instances, container clusters, databases, and corporate endpoints.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-info mono">{filteredAssets.length} Assets Listed</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search asset, IP, owner, or tag..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <select
            value={envFilter}
            onChange={e => setEnvFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Environments</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Corporate">Corporate</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Asset Health States</option>
            <option value="healthy">Healthy</option>
            <option value="at-risk">At-Risk</option>
            <option value="isolated">Isolated / Quarantined</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Asset Demarcation</th>
                <th>Type</th>
                <th>Environment</th>
                <th>Demo IP Address</th>
                <th>Owner</th>
                <th>Risk Index</th>
                <th>Status</th>
                <th>Vulnerabilities</th>
                <th>Containment Action</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No demo assets match your search parameters.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => {
                  const isIsolated = asset.status === 'isolated';

                  return (
                    <tr key={asset.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="mono">{asset.name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {asset.tags.map((tag, i) => (
                            <span key={i} className="badge badge-info mono" style={{ fontSize: '9px', padding: '1px 5px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {asset.type}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '10px' }}>
                          {asset.environment}
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{ color: 'var(--cyan-hover)' }}>
                          {asset.ipAddress}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {asset.owner}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            className="mono"
                            style={{
                              fontWeight: 700,
                              color: asset.riskScore > 75 ? 'var(--crimson-critical)' : asset.riskScore > 40 ? 'var(--amber-warning)' : 'var(--emerald-success)'
                            }}
                          >
                            {asset.riskScore}/100
                          </span>
                        </div>
                      </td>
                      <td>
                        {isIsolated ? (
                          <span className="badge badge-critical" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Lock size={11} /> ISOLATED
                          </span>
                        ) : asset.status === 'at-risk' ? (
                          <span className="badge badge-high" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldAlert size={11} /> AT RISK
                          </span>
                        ) : (
                          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={11} /> HEALTHY
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className="mono"
                          style={{
                            color: asset.vulnerabilityCount > 0 ? 'var(--amber-warning)' : 'var(--text-muted)'
                          }}
                        >
                          {asset.vulnerabilityCount} Findings
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleAssetIsolation(asset.id)}
                          className={`btn btn-sm ${isIsolated ? 'btn-secondary' : 'btn-danger'}`}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                          title={isIsolated ? 'Re-enable network interfaces (Simulated)' : 'Quarantine host from local network (Simulated)'}
                        >
                          {isIsolated ? <Unlock size={12} /> : <Lock size={12} />}
                          <span>{isIsolated ? 'Restore' : 'Isolate'}</span>
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            selectAsset(asset);
                            playSynthBeep('click');
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                          title="Inspect asset details"
                        >
                          <Eye size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Inspection Modal */}
      {selectedAsset && (
        <div className="modal-overlay" onClick={() => selectAsset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-medium)' }}>
              <div>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selectedAsset.id} • {selectedAsset.region}
                </span>
                <h3 style={{ fontSize: '17px', color: '#ffffff', marginTop: '2px' }}>
                  {selectedAsset.name}
                </h3>
              </div>
              <button
                onClick={() => selectAsset(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Environment</div>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>{selectedAsset.environment}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Owner / Team</div>
                  <div style={{ fontWeight: 600, marginTop: '2px' }}>{selectedAsset.owner}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sensor & Agent Telemetry</div>
                <div className="mono" style={{ color: 'var(--cyan-primary)', marginTop: '4px' }}>
                  {selectedAsset.agentVersion}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Last telemetry heartbeat: {selectedAsset.lastSeen}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Assigned Metadata Tags</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedAsset.tags.map((t, idx) => (
                    <span key={idx} className="badge badge-info mono">{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--cyan-dim)', border: '1px solid rgba(6,182,212,0.3)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Simulated Host Action:</strong> Toggling isolation modifies the simulated network routing table, quarantining any synthetic outbound traffic while preserving telemetry monitoring.
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  toggleAssetIsolation(selectedAsset.id);
                  selectAsset(null);
                }}
                className={`btn ${selectedAsset.status === 'isolated' ? 'btn-primary' : 'btn-danger'}`}
              >
                {selectedAsset.status === 'isolated' ? 'Unquarantine & Restore Host' : 'Isolate Host from Network'}
              </button>
              <button onClick={() => selectAsset(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
