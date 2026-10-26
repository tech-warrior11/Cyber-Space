import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  FileText,
  Search,
  Download
} from 'lucide-react';

export const AuditLogTab: React.FC = () => {
  const { auditLogs, exportAuditLogs, playSynthBeep } = useSOC();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = eventTypeFilter === 'all' || log.eventType === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Export Controls */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--cyan-primary)" />
              <h2 style={{ fontSize: '18px' }}>Security Activity & Immutable Audit Log</h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Chronological ledger of security detections, automated playbook containment actions, and analyst interventions.
            </p>
          </div>

          {/* Export Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                exportAuditLogs('json');
                playSynthBeep('click');
              }}
              className="btn btn-secondary btn-sm"
              title="Download client-side generated simulated JSON log"
            >
              <Download size={13} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => {
                exportAuditLogs('csv');
                playSynthBeep('click');
              }}
              className="btn btn-secondary btn-sm"
              title="Download client-side generated CSV spreadsheet"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search actor, target, or details..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <select
            value={eventTypeFilter}
            onChange={e => setEventTypeFilter(e.target.value)}
            className="select-control"
          >
            <option value="all">All Event Categories</option>
            <option value="Security Alert">Security Alert</option>
            <option value="Containment Action">Containment Action</option>
            <option value="Scenario Loaded">Scenario Loaded</option>
            <option value="Policy Toggle">Policy Toggle</option>
            <option value="User Inspection">User Inspection</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Timestamp (UTC)</th>
                <th>Actor / Source</th>
                <th>Category</th>
                <th>Target Asset / Policy</th>
                <th>Severity</th>
                <th>Forensic Audit Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No audit records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        {log.id}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-secondary)' }}>
                        {log.timestamp}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>
                        {log.actor}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {log.eventType}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ color: 'var(--cyan-primary)' }}>
                        {log.target}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${log.severity}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        {log.details}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
