import React from 'react';
import { SOCProvider, useSOC } from './context/SOCContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewTab } from './components/overview/OverviewTab';
import { ThreatFeedTab } from './components/threat-feed/ThreatFeedTab';
import { AssetInventoryTab } from './components/assets/AssetInventoryTab';
import { VulnerabilityTab } from './components/vulnerabilities/VulnerabilityTab';
import { IdentityTab } from './components/identity/IdentityTab';
import { IncidentTab } from './components/incident-response/IncidentTab';
import { ComplianceTab } from './components/compliance/ComplianceTab';
import { AuditLogTab } from './components/audit-log/AuditLogTab';
import { GuidedTour } from './components/tour/GuidedTour';
import { ToastContainer } from './components/common/Toast';
import { Shield, Lock } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab } = useSOC();

  return (
    <main className="content-area" role="main">
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'threats' && <ThreatFeedTab />}
      {activeTab === 'assets' && <AssetInventoryTab />}
      {activeTab === 'vulnerabilities' && <VulnerabilityTab />}
      {activeTab === 'identity' && <IdentityTab />}
      {activeTab === 'incident' && <IncidentTab />}
      {activeTab === 'compliance' && <ComplianceTab />}
      {activeTab === 'audit-log' && <AuditLogTab />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <SOCProvider>
      <div className="app-container">
        {/* Navigation Top Bar */}
        <Header />

        {/* Operations Shell */}
        <div className="main-layout">
          <Sidebar />
          <DashboardContent />
        </div>

        {/* Global Toast Messaging */}
        <ToastContainer />

        {/* Guided Interactive Onboarding Tour */}
        <GuidedTour />

        {/* Global Persistent Footer */}
        <footer
          style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-medium)',
            padding: '16px 24px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={14} color="var(--cyan-primary)" />
            <span style={{ fontWeight: 600, color: '#ffffff' }}>CYBER SPACE</span>
            <span>— Autonomous SOC & Cyber Threat Intelligence Console</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} color="var(--emerald-success)" />
              100% Client-Side Simulation (No External Network Requests)
            </span>
            <span>•</span>
            <span style={{ color: 'var(--text-muted)' }}>
              RFC 5737 Test IP Telemetry Only
            </span>
            <span>•</span>
            <span style={{ color: 'var(--cyan-primary)' }}>
              Portfolio Edition
            </span>
          </div>
        </footer>
      </div>
    </SOCProvider>
  );
};

export default App;
