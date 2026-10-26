import React from 'react';
import { useSOC } from '../../context/SOCContext';
import type { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  ShieldAlert,
  Server,
  Bug,
  KeyRound,
  Flame,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  badge?: string | number;
  badgeType?: 'critical' | 'info' | 'warning' | 'success';
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, assets, incident, vulnerabilities, playSynthBeep } = useSOC();

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const criticalVulnsCount = vulnerabilities.filter(v => v.severity === 'critical' && v.status === 'unpatched').length;

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Command Overview',
      icon: LayoutDashboard
    },
    {
      id: 'threats',
      label: 'Threat Feed',
      icon: ShieldAlert,
      badge: activeAlertsCount,
      badgeType: activeAlertsCount > 0 ? 'critical' : 'info'
    },
    {
      id: 'assets',
      label: 'Asset Inventory',
      icon: Server,
      badge: assets.length,
      badgeType: 'info'
    },
    {
      id: 'vulnerabilities',
      label: 'Exposure & CVEs',
      icon: Bug,
      badge: criticalVulnsCount > 0 ? `${criticalVulnsCount} Crit` : undefined,
      badgeType: 'critical'
    },
    {
      id: 'identity',
      label: 'Identity & Zero-Trust',
      icon: KeyRound
    },
    {
      id: 'incident',
      label: 'Incident Command',
      icon: Flame,
      badge: incident.status === 'active' ? 'Active' : undefined,
      badgeType: 'critical'
    },
    {
      id: 'compliance',
      label: 'Compliance Matrix',
      icon: CheckCircle2
    },
    {
      id: 'audit-log',
      label: 'Audit & Telemetry Log',
      icon: FileText
    }
  ];

  return (
    <aside
      style={{
        width: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-medium)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ padding: '4px 10px 8px 10px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Operations Console
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                playSynthBeep('click');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '6px',
                background: isActive ? 'var(--cyan-dim)' : 'transparent',
                border: isActive ? '1px solid rgba(6,182,212,0.35)' : '1px solid transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} color={isActive ? 'var(--cyan-primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>
                  {item.label}
                </span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`badge badge-${item.badgeType || 'info'}`}
                  style={{ fontSize: '10px', padding: '1px 6px' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subsystem Status Footprint */}
      <div
        style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span>Telemetry Stream</span>
          <span style={{ color: 'var(--emerald-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="pulsing-dot pulse-success"></span> ONLINE
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span>eBPF Probe Fleet</span>
          <span className="mono" style={{ color: 'var(--cyan-primary)' }}>128 / 128 Active</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span>Detection Engine</span>
          <span className="mono" style={{ color: 'var(--text-main)' }}>v4.2.0-STABLE</span>
        </div>
      </div>
    </aside>
  );
};
