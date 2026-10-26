// Comprehensive TypeScript interfaces for CYBER SPACE SOC Simulation

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AlertStatus = 'active' | 'investigating' | 'contained' | 'resolved';

export type AlertCategory = 
  | 'Identity & Access' 
  | 'Cloud Infrastructure' 
  | 'Endpoint Threat' 
  | 'Network Anomaly' 
  | 'Data Exfiltration' 
  | 'Application Security';

export interface ThreatAlert {
  id: string;
  title: string;
  category: AlertCategory;
  severity: Severity;
  confidence: number; // 0 to 100
  timestamp: string;
  sourceIp: string; // RFC 5737 demo IP
  targetAsset: string;
  targetAssetId: string;
  status: AlertStatus;
  summary: string;
  mitreTactic: string;
  mitreTechnique: string;
  mitreId: string;
  iocList: {
    type: 'IP' | 'Hash' | 'Domain' | 'User' | 'Process';
    value: string;
  }[];
  timeline: {
    time: string;
    description: string;
  }[];
  recommendedPlaybook: string;
}

export type AssetType = 
  | 'Cloud Compute (EC2/GCE)' 
  | 'Kubernetes Pod' 
  | 'Database Cluster' 
  | 'API Gateway' 
  | 'Workstation Endpoint' 
  | 'Object Storage Bucket';

export type AssetEnvironment = 'Production' | 'Staging' | 'Corporate' | 'Sandbox';

export type AssetStatus = 'healthy' | 'at-risk' | 'isolated' | 'offline';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  environment: AssetEnvironment;
  owner: string;
  ipAddress: string;
  region: string;
  riskScore: number; // 0 to 100
  status: AssetStatus;
  vulnerabilityCount: number;
  openAlertsCount: number;
  lastSeen: string;
  agentVersion: string;
  tags: string[];
}

export interface VulnerabilityFinding {
  id: string;
  cveId: string;
  title: string;
  severity: Severity;
  cvssScore: number;
  affectedAsset: string;
  affectedAssetId: string;
  category: string;
  discoveredDate: string;
  slaDeadline: string;
  status: 'unpatched' | 'virtual_patched' | 'remediated' | 'risk_accepted';
  remediationGuidance: string;
  vector: string;
}

export interface ZeroTrustMetric {
  mfaAdoptionRate: number; // e.g. 96.4%
  privilegedAccounts: number; // e.g. 12
  servicePrincipals: number;
  anomalousSessions: number;
  postureScore: number; // 0 to 100
  conditionalAccessRules: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    impact: string;
  }[];
}

export interface IncidentStep {
  id: string;
  label: string;
  actionText: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  actor?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: 'active' | 'mitigating' | 'contained' | 'resolved';
  leadResponder: string;
  createdAt: string;
  summary: string;
  affectedAssets: string[];
  associatedAlerts: string[];
  playbookName: string;
  steps: IncidentStep[];
}

export interface ComplianceControl {
  id: string;
  framework: 'NIST CSF 2.0' | 'ISO 27001:2022' | 'SOC 2 Type II';
  code: string;
  title: string;
  category: 'Identify' | 'Protect' | 'Detect' | 'Respond' | 'Recover' | 'Security';
  status: 'compliant' | 'needs_review' | 'non_compliant';
  description: string;
  simulatedEvidence: string;
  lastAudited: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  eventType: 'Security Alert' | 'Containment Action' | 'Scenario Loaded' | 'Policy Toggle' | 'User Inspection';
  target: string;
  details: string;
  severity: Severity;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  badge: string;
  description: string;
  contextBanner: string;
  postureScore: number;
  highlightAlertId: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'threats' 
  | 'assets' 
  | 'vulnerabilities' 
  | 'identity' 
  | 'incident' 
  | 'compliance' 
  | 'audit-log';
