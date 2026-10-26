import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  ActiveTab,
  ThreatAlert,
  Asset,
  VulnerabilityFinding,
  ZeroTrustMetric,
  Incident,
  ComplianceControl,
  AuditEvent,
  ScenarioDefinition,
  Severity,
  AlertStatus
} from '../types';
import {
  SCENARIOS,
  INITIAL_ALERTS,
  INITIAL_ASSETS,
  INITIAL_VULNERABILITIES,
  INITIAL_ZERO_TRUST,
  INITIAL_INCIDENT,
  INITIAL_COMPLIANCE_CONTROLS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  message: string;
}

interface SOCContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Scenarios
  scenarios: ScenarioDefinition[];
  activeScenario: ScenarioDefinition;
  loadScenario: (scenarioId: string) => void;

  // Telemetry & Metrics
  postureScore: number;
  mttrMinutes: number;
  eventsPerSecond: number;
  isTickerPaused: boolean;
  toggleTickerPause: () => void;
  recentTickerEvents: string[];

  // Threat Alerts
  alerts: ThreatAlert[];
  selectedAlert: ThreatAlert | null;
  selectAlert: (alert: ThreatAlert | null) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus) => void;

  // Assets
  assets: Asset[];
  selectedAsset: Asset | null;
  selectAsset: (asset: Asset | null) => void;
  toggleAssetIsolation: (assetId: string) => void;

  // Vulnerabilities
  vulnerabilities: VulnerabilityFinding[];
  patchVulnerability: (vulnId: string) => void;
  acknowledgeVulnerability: (vulnId: string) => void;

  // Zero-Trust & Identity
  zeroTrust: ZeroTrustMetric;
  toggleZeroTrustRule: (ruleId: string) => void;

  // Incident Playbook
  incident: Incident;
  executePlaybookStep: (stepId: string) => void;
  assignIncidentLead: (newLead: string) => void;

  // Compliance
  complianceControls: ComplianceControl[];
  filterFramework: string;
  setFilterFramework: (framework: string) => void;

  // Audit Logs
  auditLogs: AuditEvent[];
  addAuditLog: (actor: string, eventType: AuditEvent['eventType'], target: string, details: string, severity?: Severity) => void;
  exportAuditLogs: (format: 'json' | 'csv') => void;

  // Guided Tour
  isTourOpen: boolean;
  tourStep: number;
  startTour: () => void;
  closeTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;

  // Audio & UI
  soundEnabled: boolean;
  toggleSound: () => void;
  playSynthBeep: (type?: 'click' | 'alert' | 'success') => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;

  // Reset
  resetAllData: () => void;
}

const SOCContext = createContext<SOCContextType | undefined>(undefined);

export const SOCProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeScenario, setActiveScenario] = useState<ScenarioDefinition>(SCENARIOS[0]);
  const [alerts, setAlerts] = useState<ThreatAlert[]>(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(null);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityFinding[]>(INITIAL_VULNERABILITIES);
  const [zeroTrust, setZeroTrust] = useState<ZeroTrustMetric>(INITIAL_ZERO_TRUST);
  const [incident, setIncident] = useState<Incident>(INITIAL_INCIDENT);
  const [complianceControls] = useState<ComplianceControl[]>(INITIAL_COMPLIANCE_CONTROLS);
  const [filterFramework, setFilterFramework] = useState<string>('All');
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);

  // Live Metrics
  const [eventsPerSecond, setEventsPerSecond] = useState<number>(482);
  const [isTickerPaused, setIsTickerPaused] = useState<boolean>(false);
  const [recentTickerEvents, setRecentTickerEvents] = useState<string[]>([
    'SYNTAX_SCAN_BLOCKED: Edge WAF quarantined 198.51.100.99 (RFC 5737 demo IP)',
    'IDENTITY_STS_ELEVATION: Unusual AssumeRole API call observed on prod-iam-vault',
    'CONTAINER_EGRESS_SPIKE: k8s-worker-node-04 outbound flow correlated with sinkhole rule',
    'EDR_DEVICE_HEARTBEAT: 128/128 synthetic enterprise sensors actively synchronizing',
    'CSPM_COMPLIANCE_SCAN: NIST CSF 2.0 daily posture evaluation scored at 88%'
  ]);

  // Audio & Toasts
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Tour
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  // Play subtle synthetic beep using client-side Web Audio oscillator
  const playSynthBeep = useCallback((type: 'click' | 'alert' | 'success' = 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.setValueAtTime(560, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add audit log helper
  const addAuditLog = useCallback((
    actor: string,
    eventType: AuditEvent['eventType'],
    target: string,
    details: string,
    severity: Severity = 'info'
  ) => {
    const newEntry: AuditEvent = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      actor,
      eventType,
      target,
      details,
      severity
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 49)]);
  }, []);

  // Posture Score calculation based on active scenario, open critical alerts, and zero-trust policies
  const calculatePostureScore = useCallback(() => {
    let score = activeScenario.postureScore;
    
    // Reward enabled Zero-Trust rules
    const enabledRules = zeroTrust.conditionalAccessRules.filter(r => r.enabled).length;
    score += (enabledRules - 2) * 4;

    // Penalty for active critical alerts
    const activeCritical = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
    score -= activeCritical * 6;

    // Reward completed incident steps
    const completedSteps = incident.steps.filter(s => s.completed).length;
    score += completedSteps * 3;

    return Math.max(25, Math.min(98, score));
  }, [activeScenario, zeroTrust, alerts, incident]);

  const postureScore = calculatePostureScore();
  const mttrMinutes = 14.4; // Simulated MTTR

  // Load a scenario
  const loadScenario = useCallback((scenarioId: string) => {
    const found = SCENARIOS.find(s => s.id === scenarioId);
    if (!found) return;

    setActiveScenario(found);
    playSynthBeep('alert');
    showToast('Scenario Initialized (Simulated)', found.contextBanner, 'info');
    addAuditLog('Operator', 'Scenario Loaded', found.name, `Loaded ${found.badge} simulated conditions`, 'info');

    // Dynamically adjust alerts & asset statuses according to scenario
    if (scenarioId === 'scenario-cloud-iam') {
      setAlerts(INITIAL_ALERTS);
      setAssets(INITIAL_ASSETS);
    } else if (scenarioId === 'scenario-s3-leak') {
      setAlerts(prev => prev.map(a => 
        a.id === 'NEX-8825' ? { ...a, status: 'active', severity: 'critical' } : a
      ));
      setAssets(prev => prev.map(ast => 
        ast.id === 'ast-005' ? { ...ast, riskScore: 92, status: 'at-risk' } : ast
      ));
    } else if (scenarioId === 'scenario-spear-phish') {
      setAlerts(prev => prev.map(a => 
        a.id === 'NEX-8830' ? { ...a, status: 'active', severity: 'critical' } : a
      ));
      setAssets(prev => prev.map(ast => 
        ast.id === 'ast-008' ? { ...ast, riskScore: 89, status: 'at-risk' } : ast
      ));
    }
  }, [addAuditLog, playSynthBeep, showToast]);

  // Update alert status
  const updateAlertStatus = useCallback((alertId: string, status: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));
    playSynthBeep('click');
    showToast('Alert Status Updated (Simulated)', `Alert ${alertId} updated to ${status}.`, 'info');
    addAuditLog('Analyst', 'Security Alert', alertId, `Updated status to ${status}`, 'info');
  }, [addAuditLog, playSynthBeep, showToast]);

  // Toggle asset isolation
  const toggleAssetIsolation = useCallback((assetId: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const nextStatus = a.status === 'isolated' ? 'healthy' : 'isolated';
        const msg = nextStatus === 'isolated' 
          ? `Asset ${a.name} isolated from simulated network.` 
          : `Asset ${a.name} unquarantined and restored.`;
        showToast(nextStatus === 'isolated' ? 'Host Isolated (Simulated)' : 'Host Restored', msg, nextStatus === 'isolated' ? 'warning' : 'success');
        addAuditLog('Security Playbook', 'Containment Action', a.name, msg, nextStatus === 'isolated' ? 'high' : 'info');
        return { ...a, status: nextStatus, riskScore: nextStatus === 'isolated' ? 15 : a.riskScore };
      }
      return a;
    }));
    playSynthBeep('success');
  }, [addAuditLog, playSynthBeep, showToast]);

  // Patch vulnerability finding
  const patchVulnerability = useCallback((vulnId: string) => {
    setVulnerabilities(prev => prev.map(v => {
      if (v.id === vulnId) {
        showToast('Virtual Patch Deployed (Simulated)', `Firewall & WAF mitigation applied for ${v.cveId}.`, 'success');
        addAuditLog('Virtual Patch Engine', 'Policy Toggle', v.affectedAsset, `Applied WAF inspection rule for ${v.cveId}`, 'info');
        return { ...v, status: 'virtual_patched' };
      }
      return v;
    }));
    playSynthBeep('success');
  }, [addAuditLog, playSynthBeep, showToast]);

  const acknowledgeVulnerability = useCallback((vulnId: string) => {
    setVulnerabilities(prev => prev.map(v => {
      if (v.id === vulnId) {
        showToast('Risk Exception Granted (Simulated)', `SLA exception registered for ${v.cveId} for 14 days.`, 'warning');
        addAuditLog('Compliance Lead', 'Policy Toggle', v.cveId, `Approved temporary risk acceptance`, 'low');
        return { ...v, status: 'risk_accepted' };
      }
      return v;
    }));
    playSynthBeep('click');
  }, [addAuditLog, playSynthBeep, showToast]);

  // Toggle Zero Trust Rule
  const toggleZeroTrustRule = useCallback((ruleId: string) => {
    setZeroTrust(prev => {
      const updatedRules = prev.conditionalAccessRules.map(r => 
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      );
      const rule = updatedRules.find(r => r.id === ruleId);
      const isEnabled = rule?.enabled;
      showToast(
        isEnabled ? 'Zero-Trust Rule Active (Simulated)' : 'Zero-Trust Rule Disabled',
        `Policy "${rule?.name}" status updated.`,
        isEnabled ? 'success' : 'warning'
      );
      addAuditLog('Identity Gatekeeper', 'Policy Toggle', rule?.name || ruleId, isEnabled ? 'Enforced policy' : 'Disabled policy', 'info');
      return { ...prev, conditionalAccessRules: updatedRules };
    });
    playSynthBeep('click');
  }, [addAuditLog, playSynthBeep, showToast]);

  // Incident Playbook step execution
  const executePlaybookStep = useCallback((stepId: string) => {
    setIncident(prev => {
      const stepIndex = prev.steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) return prev;

      const newSteps = [...prev.steps];
      const step = newSteps[stepIndex];
      const isNowCompleted = !step.completed;

      newSteps[stepIndex] = {
        ...step,
        completed: isNowCompleted,
        completedAt: isNowCompleted ? new Date().toISOString().substring(11, 19) + ' UTC' : undefined,
        actor: isNowCompleted ? 'Elena Vance (Lead SOC Analyst)' : undefined
      };

      const allDone = newSteps.every(s => s.completed);
      const nextStatus = allDone ? 'resolved' : 'mitigating';

      showToast(
        isNowCompleted ? 'Playbook Action Executed (Simulated)' : 'Playbook Action Reverted',
        `${step.actionText}: Local simulated state updated successfully.`,
        isNowCompleted ? 'success' : 'warning'
      );

      addAuditLog(
        'Elena Vance',
        'Containment Action',
        step.label,
        isNowCompleted ? `Executed playbook action: ${step.actionText}` : `Reverted action: ${step.actionText}`,
        isNowCompleted ? 'high' : 'info'
      );

      // If step 1 (isolate pod), reflect in assets
      if (stepId === 'step-1' && isNowCompleted) {
        setAssets(curr => curr.map(a => a.id === 'ast-003' ? { ...a, status: 'isolated' } : a));
      }
      // If step 5 (mark resolved), update alert NEX-8821 to resolved
      if (stepId === 'step-5' && isNowCompleted) {
        setAlerts(curr => curr.map(a => a.id === 'NEX-8821' ? { ...a, status: 'resolved' } : a));
      }

      return {
        ...prev,
        steps: newSteps,
        status: nextStatus
      };
    });
    playSynthBeep('success');
  }, [addAuditLog, playSynthBeep, showToast]);

  const assignIncidentLead = useCallback((newLead: string) => {
    setIncident(prev => ({ ...prev, leadResponder: newLead }));
    showToast('Incident Lead Assigned (Simulated)', `Primary responder set to: ${newLead}`, 'info');
    addAuditLog('SOC Manager', 'Security Alert', 'INC-2026-042', `Reassigned lead responder to ${newLead}`, 'info');
    playSynthBeep('click');
  }, [addAuditLog, playSynthBeep, showToast]);

  // Export audit logs as downloadable JSON or CSV (safely generated locally in the browser!)
  const exportAuditLogs = useCallback((format: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    let fileName = '';

    if (format === 'json') {
      content = JSON.stringify({
        project: 'CYBER SPACE',
        generatedAt: new Date().toISOString(),
        disclaimer: 'SYNTHETIC SIMULATED AUDIT DATA ONLY - FOR DEMO PURPOSES',
        events: auditLogs
      }, null, 2);
      mimeType = 'application/json';
      fileName = `cyber-space-audit-${Date.now()}.json`;
    } else {
      const header = 'ID,Timestamp,Actor,EventType,Target,Severity,Details\n';
      const rows = auditLogs.map(l => 
        `"${l.id}","${l.timestamp}","${l.actor}","${l.eventType}","${l.target}","${l.severity}","${l.details.replace(/"/g, '""')}"`
      ).join('\n');
      content = header + rows;
      mimeType = 'text/csv';
      fileName = `cyber-space-audit-${Date.now()}.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Audit Log Exported', `Downloaded ${fileName} (Simulated client-side export).`, 'success');
    addAuditLog('Visitor', 'User Inspection', 'Audit Log', `Exported ${auditLogs.length} simulated audit events as ${format.toUpperCase()}`);
    playSynthBeep('click');
  }, [addAuditLog, auditLogs, playSynthBeep, showToast]);

  // Reset all data
  const resetAllData = useCallback(() => {
    setActiveScenario(SCENARIOS[0]);
    setAlerts(INITIAL_ALERTS);
    setSelectedAlert(null);
    setAssets(INITIAL_ASSETS);
    setSelectedAsset(null);
    setVulnerabilities(INITIAL_VULNERABILITIES);
    setZeroTrust(INITIAL_ZERO_TRUST);
    setIncident(INITIAL_INCIDENT);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    showToast('Demo Data Reset', 'All simulated SOC telemetry, alerts, and assets restored to pristine baseline.', 'info');
    addAuditLog('System', 'Scenario Loaded', 'Cyber Space Engine', 'Reset all local demo state to default', 'info');
    playSynthBeep('success');
  }, [addAuditLog, playSynthBeep, showToast]);

  // Guided Tour handlers
  const startTour = () => {
    setIsTourOpen(true);
    setTourStep(0);
    playSynthBeep('click');
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const nextTourStep = () => {
    setTourStep(prev => prev + 1);
    playSynthBeep('click');
  };

  const prevTourStep = () => {
    setTourStep(prev => Math.max(0, prev - 1));
    playSynthBeep('click');
  };

  const toggleTickerPause = () => {
    setIsTickerPaused(prev => !prev);
  };

  // Periodic synthetic telemetry jitter to make the SOC feel dynamic & alive
  useEffect(() => {
    if (isTickerPaused) return;

    const interval = setInterval(() => {
      // Jitter EPS slightly (470 - 520)
      setEventsPerSecond(Math.floor(460 + Math.random() * 75));

      // 10% chance of inserting a synthetic background event into ticker
      if (Math.random() < 0.25) {
        const syntheticEvents = [
          'FLOW_LOG_CHECK: Port scan dropped by Edge WAF for 203.0.113.88',
          'IAM_CREDENTIAL_AUDIT: Key rotation completed for svc_demo_pipeline',
          'DNS_QUERY_INSPECT: Low latency benign query to internal DNS resolver',
          'CONTAINER_SEC_SCAN: Docker daemon benchmark passed across 4 clusters',
          'ZT_DEVICE_HEALTH: macOS fleet device posture verified 99.1% healthy',
          'API_RATE_GUARD: 140 rps baseline within standard deviation limits'
        ];
        const nextEvent = syntheticEvents[Math.floor(Math.random() * syntheticEvents.length)];
        setRecentTickerEvents(prev => [nextEvent, ...prev.slice(0, 5)]);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isTickerPaused]);

  return (
    <SOCContext.Provider
      value={{
        activeTab,
        setActiveTab,
        scenarios: SCENARIOS,
        activeScenario,
        loadScenario,
        postureScore,
        mttrMinutes,
        eventsPerSecond,
        isTickerPaused,
        toggleTickerPause,
        recentTickerEvents,
        alerts,
        selectedAlert,
        selectAlert: setSelectedAlert,
        updateAlertStatus,
        assets,
        selectedAsset,
        selectAsset: setSelectedAsset,
        toggleAssetIsolation,
        vulnerabilities,
        patchVulnerability,
        acknowledgeVulnerability,
        zeroTrust,
        toggleZeroTrustRule,
        incident,
        executePlaybookStep,
        assignIncidentLead,
        complianceControls,
        filterFramework,
        setFilterFramework,
        auditLogs,
        addAuditLog,
        exportAuditLogs,
        isTourOpen,
        tourStep,
        startTour,
        closeTour,
        nextTourStep,
        prevTourStep,
        soundEnabled,
        toggleSound,
        playSynthBeep,
        toasts,
        dismissToast,
        showToast,
        resetAllData
      }}
    >
      {children}
    </SOCContext.Provider>
  );
};

export const useSOC = (): SOCContextType => {
  const context = useContext(SOCContext);
  if (!context) {
    throw new Error('useSOC must be used within a SOCProvider');
  }
  return context;
};
