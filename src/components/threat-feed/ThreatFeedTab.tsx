import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { AlertDetailDrawer } from './AlertDetailDrawer';
import {
  Search,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const ThreatFeedTab: React.FC = () => {
  const { alerts, selectedAlert, selectAlert, playSynthBeep } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.targetAsset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.mitreTechnique.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesCategory && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Filter Controls */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="var(--crimson-critical)" />
              <h2 style={{ fontSize: '18px' }}>Threat Intelligence & Alert Queue</h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Synthetic detections ingested from eBPF sensors, AWS CloudTrail, and endpoint security agents.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-info mono">{filteredAlerts.length} Matching Alerts</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search alert, asset, CVE, or IOC..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Threat Domains</option>
            <option value="Identity & Access">Identity & Access</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Endpoint Threat">Endpoint Threat</option>
            <option value="Network Anomaly">Network Anomaly</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="contained">Contained</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Severity</th>
                <th>Threat Title</th>
                <th>Category</th>
                <th>Target Asset</th>
                <th>Source (Demo IP)</th>
                <th>Confidence</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No simulated alerts match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr
                    key={alert.id}
                    onClick={() => {
                      selectAlert(alert);
                      playSynthBeep('click');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span className="mono" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                        {alert.id}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${alert.severity}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{alert.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {alert.mitreTechnique}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {alert.category}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ color: 'var(--cyan-primary)' }}>
                        {alert.targetAsset}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                        {alert.sourceIp}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ color: alert.confidence > 90 ? 'var(--emerald-success)' : 'var(--amber-warning)' }}>
                        {alert.confidence}%
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {alert.timestamp}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          selectAlert(alert);
                          playSynthBeep('click');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        <span>Triage</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Forensic Detail Drawer */}
      {selectedAlert && (
        <AlertDetailDrawer
          alert={selectedAlert}
          onClose={() => selectAlert(null)}
        />
      )}
    </div>
  );
};
