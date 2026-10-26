import type {
  ThreatAlert,
  Asset,
  VulnerabilityFinding,
  ZeroTrustMetric,
  Incident,
  ComplianceControl,
  AuditEvent,
  ScenarioDefinition
} from '../types';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'scenario-cloud-iam',
    name: 'Scenario 1: Cloud IAM Anomaly & Privilege Escalation',
    badge: 'AWS Prod // FinTech',
    description: 'Suspicious session from unknown ASN attempting AssumeRole on high-privilege administrative IAM role.',
    contextBanner: 'Simulating multi-cloud IAM anomaly: unusual STS AssumeRole API call detected from unrecognized ASN (RFC 5737 demo IP). Cyber Space AI elevated threat score to 89.',
    postureScore: 68,
    highlightAlertId: 'NEX-8821'
  },
  {
    id: 'scenario-s3-leak',
    name: 'Scenario 2: Public Bucket Exposure & Secret Leak',
    badge: 'Storage // Data Platform',
    description: 'Storage bucket policy configuration drift allowed unauthenticated read access to synthetic application log archives.',
    contextBanner: 'Simulating cloud storage exposure: Bucket demo-analytics-lake-us-east set to public-read during automated terraform deploy. Secret scanner flagged synthetic API token.',
    postureScore: 74,
    highlightAlertId: 'NEX-8825'
  },
  {
    id: 'scenario-spear-phish',
    name: 'Scenario 3: Spear-Phishing & Lateral Host Probe',
    badge: 'Endpoint // Corporate Fleet',
    description: 'OAuth consent spoofing campaign targeting developer workstation followed by internal SMB reconnaissance.',
    contextBanner: 'Simulating corporate endpoint compromise: Suspicious PowerShell process execution spawned from browser cache; internal port scan directed at database cluster.',
    postureScore: 61,
    highlightAlertId: 'NEX-8830'
  }
];

export const INITIAL_ALERTS: ThreatAlert[] = [
  {
    id: 'NEX-8821',
    title: 'Anomalous STS AssumeRole from Unrecognized Autonomous System',
    category: 'Identity & Access',
    severity: 'critical',
    confidence: 94,
    timestamp: '2 mins ago',
    sourceIp: '198.51.100.44',
    targetAsset: 'prod-iam-vault.demo.internal',
    targetAssetId: 'ast-001',
    status: 'active',
    summary: 'Automated detection flagged STS AssumeRole request for role "DevOpsAdminRole" originating from an anomalous ASN not seen in the 90-day baseline.',
    mitreTactic: 'Privilege Escalation (TA0004)',
    mitreTechnique: 'Valid Accounts: Cloud Accounts (T1078.004)',
    mitreId: 'T1078.004',
    iocList: [
      { type: 'IP', value: '198.51.100.44 (RFC 5737 Demo IP)' },
      { type: 'User', value: 'svc_demo_cicd@demo-corp.internal' },
      { type: 'Process', value: 'aws-sdk-go/v2.19.4' },
      { type: 'Domain', value: 'auth.vault-demo.internal' }
    ],
    timeline: [
      { time: '14:21:04 UTC', description: 'Simulated API key used to initiate session from unrecognized ASN.' },
      { time: '14:21:19 UTC', description: 'Call to sts:GetCallerIdentity verified synthetic caller profile.' },
      { time: '14:22:01 UTC', description: 'sts:AssumeRole requested for arn:aws:iam::123456789012:role/DevOpsAdminRole.' },
      { time: '14:22:03 UTC', description: 'Cyber Space automated risk engine triggered High Priority Investigation.' }
    ],
    recommendedPlaybook: 'Cloud IAM Invalidation & Session Revocation'
  },
  {
    id: 'NEX-8823',
    title: 'Unusual Outbound Beaconing Pattern to Demo C2 Sinkhole',
    category: 'Endpoint Threat',
    severity: 'critical',
    confidence: 91,
    timestamp: '8 mins ago',
    sourceIp: '192.0.2.118',
    targetAsset: 'k8s-worker-node-04.prod',
    targetAssetId: 'ast-003',
    status: 'investigating',
    summary: 'Periodic HTTPS requests at exact 30.0-second intervals observed from container runtime to synthetic sinkhole domain beacon.c2-demo.test.',
    mitreTactic: 'Command and Control (TA0011)',
    mitreTechnique: 'Application Layer Protocol: Web Protocols (T1071.001)',
    mitreId: 'T1071.001',
    iocList: [
      { type: 'IP', value: '203.0.113.88 (RFC 5737 Demo IP)' },
      { type: 'Domain', value: 'beacon.c2-demo.test' },
      { type: 'Process', value: '/usr/local/bin/container-runtime-shim' },
      { type: 'Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    ],
    timeline: [
      { time: '14:14:12 UTC', description: 'First observed 30s jittered telemetry outbound from worker pod.' },
      { time: '14:16:42 UTC', description: 'Network flow analyzer detected persistent 128-byte encrypted payloads.' },
      { time: '14:18:00 UTC', description: 'Alert correlated with recent container image update from staging registry.' }
    ],
    recommendedPlaybook: 'Kubernetes Pod Isolation & Image Signature Quarantine'
  },
  {
    id: 'NEX-8825',
    title: 'S3 Storage Bucket Public Read ACL Policy Drift',
    category: 'Cloud Infrastructure',
    severity: 'high',
    confidence: 98,
    timestamp: '19 mins ago',
    sourceIp: '198.51.100.12',
    targetAsset: 's3-analytics-lake-east',
    targetAssetId: 'ast-005',
    status: 'active',
    summary: 'Cloud trail event indicates bucket ACL modified to grant AllUsers Read access during automated CI pipeline terraform apply.',
    mitreTactic: 'Exfiltration (TA0010)',
    mitreTechnique: 'Data Transfer to Cloud Account (T1537)',
    mitreId: 'T1537',
    iocList: [
      { type: 'Domain', value: 's3-analytics-lake-east.s3.demo.internal' },
      { type: 'User', value: 'terraform-pipeline-agent' },
      { type: 'IP', value: '198.51.100.12 (RFC 5737 Demo IP)' }
    ],
    timeline: [
      { time: '14:02:11 UTC', description: 'Terraform run #842 applied updated bucket policy configuration.' },
      { time: '14:03:00 UTC', description: 'Bucket public access block override detected by CSPM scanner.' },
      { time: '14:03:15 UTC', description: 'Automated remediation policy triggered Cyber Space advisory alert.' }
    ],
    recommendedPlaybook: 'Enforce S3 Block Public Access & Revert Bucket ACL'
  },
  {
    id: 'NEX-8828',
    title: 'Repeated Kerberos Pre-Authentication Failures (Simulated AS-REP Roasting)',
    category: 'Identity & Access',
    severity: 'high',
    confidence: 87,
    timestamp: '34 mins ago',
    sourceIp: '192.0.2.75',
    targetAsset: 'dc-primary.corp.internal',
    targetAssetId: 'ast-007',
    status: 'investigating',
    summary: 'Over 140 Kerberos AS-REQ requests requesting RC4-HMAC cipher without pre-authentication targeted at 15 service accounts within 2 minutes.',
    mitreTactic: 'Credential Access (TA0006)',
    mitreTechnique: 'Steal or Forge Kerberos Tickets: AS-REP Roasting (T1558.004)',
    mitreId: 'T1558.004',
    iocList: [
      { type: 'IP', value: '192.0.2.75 (RFC 5737 Demo IP)' },
      { type: 'User', value: 'svc_backup_agent, svc_sql_read' },
      { type: 'Domain', value: 'corp.internal' }
    ],
    timeline: [
      { time: '13:48:02 UTC', description: 'Spike in event ID 4768 (A Kerberos authentication ticket was requested).' },
      { time: '13:49:15 UTC', description: 'Event ID 4768 result code 0x18 (Pre-authentication information was invalid).' }
    ],
    recommendedPlaybook: 'Enforce AES256 Only & Rotate Service Principal Passwords'
  },
  {
    id: 'NEX-8830',
    title: 'Spear-Phishing Payload Download Attempt via Suspicious Link',
    category: 'Endpoint Threat',
    severity: 'medium',
    confidence: 84,
    timestamp: '48 mins ago',
    sourceIp: '203.0.113.190',
    targetAsset: 'workstation-mac-eng-42',
    targetAssetId: 'ast-008',
    status: 'contained',
    summary: 'Endpoint browser sandbox intercepted binary download "payroll_update_q4.dmg" matching known heuristic signature for credential stealer.',
    mitreTactic: 'Initial Access (TA0001)',
    mitreTechnique: 'Phishing: Spearphishing Link (T1566.002)',
    mitreId: 'T1566.002',
    iocList: [
      { type: 'Domain', value: 'portal-hr-verify-demo.site' },
      { type: 'Hash', value: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
      { type: 'IP', value: '203.0.113.190 (RFC 5737 Demo IP)' }
    ],
    timeline: [
      { time: '13:32:00 UTC', description: 'User opened inbound link from simulated external email.' },
      { time: '13:32:08 UTC', description: 'Browser defense module blocked payload write to disk.' },
      { time: '13:33:00 UTC', description: 'Endpoint isolated automatically per demo zero-trust posture rule.' }
    ],
    recommendedPlaybook: 'Workstation Triage & Mail Gateway Purge'
  },
  {
    id: 'NEX-8832',
    title: 'Distributed Port Scan on Perimeter Load Balancer',
    category: 'Network Anomaly',
    severity: 'low',
    confidence: 96,
    timestamp: '1 hour ago',
    sourceIp: '198.51.100.99',
    targetAsset: 'edge-api-gateway-us-east',
    targetAssetId: 'ast-004',
    status: 'resolved',
    summary: 'Low-rate SYN scan traversing ports 8000-9200 dropped at edge WAF according to rate-limiting rate rules.',
    mitreTactic: 'Reconnaissance (TA0043)',
    mitreTechnique: 'Network Service Discovery (T1046)',
    mitreId: 'T1046',
    iocList: [
      { type: 'IP', value: '198.51.100.99 (RFC 5737 Demo IP)' }
    ],
    timeline: [
      { time: '13:00:10 UTC', description: 'SYN packets dropped across multiple non-exposed ports.' },
      { time: '13:02:00 UTC', description: 'WAF rate limit auto-engaged for 60-minute quarantine window.' }
    ],
    recommendedPlaybook: 'Edge Rate Limiting & Geo-Filtering Review'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-001',
    name: 'prod-iam-vault.demo.internal',
    type: 'Cloud Compute (EC2/GCE)',
    environment: 'Production',
    owner: 'Platform Security Team',
    ipAddress: '192.0.2.14',
    region: 'us-east-1',
    riskScore: 88,
    status: 'at-risk',
    vulnerabilityCount: 3,
    openAlertsCount: 1,
    lastSeen: '1 min ago',
    agentVersion: 'Cyber Space Agent v4.8.2 (Healthy)',
    tags: ['PCI-DSS', 'Core-Auth', 'AWS']
  },
  {
    id: 'ast-002',
    name: 'db-customer-aurora-cluster',
    type: 'Database Cluster',
    environment: 'Production',
    owner: 'Data Engineering Lead',
    ipAddress: '192.0.2.45',
    region: 'us-east-1',
    riskScore: 42,
    status: 'healthy',
    vulnerabilityCount: 1,
    openAlertsCount: 0,
    lastSeen: '3 mins ago',
    agentVersion: 'DB Sensor v3.1.0',
    tags: ['Encrypted-At-Rest', 'PII', 'High-Availability']
  },
  {
    id: 'ast-003',
    name: 'k8s-worker-node-04.prod',
    type: 'Kubernetes Pod',
    environment: 'Production',
    owner: 'DevOps & SRE',
    ipAddress: '198.51.100.52',
    region: 'us-west-2',
    riskScore: 82,
    status: 'at-risk',
    vulnerabilityCount: 5,
    openAlertsCount: 1,
    lastSeen: 'Just now',
    agentVersion: 'eBPF Sensor v2.4.1',
    tags: ['Container-Host', 'Microservices', 'EKS']
  },
  {
    id: 'ast-004',
    name: 'edge-api-gateway-us-east',
    type: 'API Gateway',
    environment: 'Production',
    owner: 'Edge Infrastructure',
    ipAddress: '203.0.113.15',
    region: 'us-east-1',
    riskScore: 24,
    status: 'healthy',
    vulnerabilityCount: 0,
    openAlertsCount: 0,
    lastSeen: '30 secs ago',
    agentVersion: 'WAF Module v5.0.1',
    tags: ['Public-Facing', 'mTLS', 'DDoS-Shield']
  },
  {
    id: 'ast-005',
    name: 's3-analytics-lake-east',
    type: 'Object Storage Bucket',
    environment: 'Production',
    owner: 'BI & Analytics',
    ipAddress: '203.0.113.89',
    region: 'us-east-1',
    riskScore: 76,
    status: 'at-risk',
    vulnerabilityCount: 2,
    openAlertsCount: 1,
    lastSeen: '5 mins ago',
    agentVersion: 'Cloud Security Posture Monitor',
    tags: ['Parquet-Logs', 'Data-Lake']
  },
  {
    id: 'ast-006',
    name: 'staging-k8s-control-plane',
    type: 'Kubernetes Pod',
    environment: 'Staging',
    owner: 'QA Automation',
    ipAddress: '192.0.2.88',
    region: 'eu-central-1',
    riskScore: 18,
    status: 'healthy',
    vulnerabilityCount: 2,
    openAlertsCount: 0,
    lastSeen: '12 mins ago',
    agentVersion: 'eBPF Sensor v2.4.1',
    tags: ['Pre-Prod', 'Ephemeral']
  },
  {
    id: 'ast-007',
    name: 'dc-primary.corp.internal',
    type: 'Cloud Compute (EC2/GCE)',
    environment: 'Corporate',
    owner: 'Identity & Directory Team',
    ipAddress: '192.0.2.75',
    region: 'us-east-2',
    riskScore: 68,
    status: 'at-risk',
    vulnerabilityCount: 4,
    openAlertsCount: 1,
    lastSeen: '2 mins ago',
    agentVersion: 'Cyber Space Agent v4.8.2',
    tags: ['ActiveDirectory', 'SSO', 'Critical-Infra']
  },
  {
    id: 'ast-008',
    name: 'workstation-mac-eng-42',
    type: 'Workstation Endpoint',
    environment: 'Corporate',
    owner: 'Senior Backend Engineer',
    ipAddress: '198.51.100.110',
    region: 'Remote Fleet (VPN)',
    riskScore: 35,
    status: 'isolated',
    vulnerabilityCount: 1,
    openAlertsCount: 1,
    lastSeen: '10 mins ago',
    agentVersion: 'EDR Endpoint Suite v6.12',
    tags: ['macOS-Sequoia', 'Zero-Trust-Enrolled']
  }
];

export const INITIAL_VULNERABILITIES: VulnerabilityFinding[] = [
  {
    id: 'vuln-01',
    cveId: 'CVE-2026-31901 (Simulated)',
    title: 'Remote Code Execution in Demo Container Runtime Engine',
    severity: 'critical',
    cvssScore: 9.8,
    affectedAsset: 'k8s-worker-node-04.prod',
    affectedAssetId: 'ast-003',
    category: 'Container Security',
    discoveredDate: '2026-10-21',
    slaDeadline: '24 Hours (Urgent)',
    status: 'unpatched',
    remediationGuidance: 'Update container daemon runtime to v2.6.4 or apply virtual patch firewall rule 8092 to restrict control socket exposure.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
  },
  {
    id: 'vuln-02',
    cveId: 'CVE-2026-28104 (Simulated)',
    title: 'Improper Privilege Management in Synthetic Cloud IAM Provider',
    severity: 'high',
    cvssScore: 8.4,
    affectedAsset: 'prod-iam-vault.demo.internal',
    affectedAssetId: 'ast-001',
    category: 'Identity & Access',
    discoveredDate: '2026-10-23',
    slaDeadline: '48 Hours',
    status: 'unpatched',
    remediationGuidance: 'Enforce boundary permissions on STS assume-role policies and mandate MFA condition keys on privileged IAM paths.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:L/A:N'
  },
  {
    id: 'vuln-03',
    cveId: 'CVE-2026-19442 (Simulated)',
    title: 'Missing Encryption in Transit for Internal Metric Scraping',
    severity: 'medium',
    cvssScore: 5.7,
    affectedAsset: 'staging-k8s-control-plane',
    affectedAssetId: 'ast-006',
    category: 'Network Cryptography',
    discoveredDate: '2026-10-24',
    slaDeadline: '7 Days',
    status: 'virtual_patched',
    remediationGuidance: 'Configure mTLS for Prometheus telemetry scrapers and inject client certificates via automated cert-manager.',
    vector: 'CVSS:3.1/AV:A/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N'
  },
  {
    id: 'vuln-04',
    cveId: 'CVE-2026-11090 (Simulated)',
    title: 'Outdated OpenSSH Cryptographic Cipher Suite Allowed',
    severity: 'low',
    cvssScore: 3.8,
    affectedAsset: 'dc-primary.corp.internal',
    affectedAssetId: 'ast-007',
    category: 'Host Configuration',
    discoveredDate: '2026-10-20',
    slaDeadline: '14 Days',
    status: 'remediated',
    remediationGuidance: 'Update sshd_config to disable legacy CBC ciphers; require ed25519 or chacha20-poly1305@openssh.com.',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N'
  }
];

export const INITIAL_ZERO_TRUST: ZeroTrustMetric = {
  mfaAdoptionRate: 94.8,
  privilegedAccounts: 14,
  servicePrincipals: 42,
  anomalousSessions: 2,
  postureScore: 86,
  conditionalAccessRules: [
    {
      id: 'zt-rule-1',
      name: 'Mandatory FIDO2 Hardware Key for AWS Management Console',
      description: 'Require hardware security key (WebAuthn/FIDO2) for all console logins with admin privileges.',
      enabled: true,
      impact: 'Reduces credential stuffing risk by ~99%'
    },
    {
      id: 'zt-rule-2',
      name: 'Device Health & EDR Telemetry Verification',
      description: 'Block internal corporate access if workstation EDR agent is missing, offline, or reporting critical infections.',
      enabled: true,
      impact: 'Prevents compromised endpoints from reaching internal database cluster'
    },
    {
      id: 'zt-rule-3',
      name: 'Geo-Velocity & Impossible Travel Anomaly Guard',
      description: 'Trigger immediate step-up authentication when successive logins occur faster than commercial flight speed.',
      enabled: true,
      impact: 'Intercepts compromised session tokens reused from remote exit nodes'
    },
    {
      id: 'zt-rule-4',
      name: 'Just-In-Time (JIT) Temporary Privilege Elevation',
      description: 'All production root & database modifications require automated 60-minute scoped elevation with manager approval.',
      enabled: false,
      impact: 'Eliminates standing high privileges across cloud infrastructure'
    }
  ]
};

export const INITIAL_INCIDENT: Incident = {
  id: 'INC-2026-042',
  title: 'Active Multi-Stage IAM Privilege Escalation & Container Probe',
  severity: 'critical',
  status: 'active',
  leadResponder: 'Elena Vance (Lead SOC Analyst - Simulated)',
  createdAt: '2026-10-25 14:21:04 UTC',
  summary: 'Correlated multi-source event: Rogue API session requested STS AssumeRole privilege elevation concurrently with container outbound C2 beaconing on worker node 04.',
  affectedAssets: ['prod-iam-vault.demo.internal', 'k8s-worker-node-04.prod'],
  associatedAlerts: ['NEX-8821', 'NEX-8823'],
  playbookName: 'Cloud Incident Containment & Eviction Playbook (Simulated)',
  steps: [
    {
      id: 'step-1',
      label: 'Contain Cloud Host & Pod Runtime',
      actionText: 'Isolate Affected Kubernetes Pod',
      description: 'Isolate k8s-worker-node-04 by updating network policy to deny all ingress/egress except telemetry.',
      completed: false
    },
    {
      id: 'step-2',
      label: 'Invalidate Compromised IAM Session Tokens',
      actionText: 'Revoke STS AssumeRole Sessions',
      description: 'Revoke active STS sessions for role DevOpsAdminRole and attach inline deny policy for RFC 5737 demo IP.',
      completed: false
    },
    {
      id: 'step-3',
      label: 'Deploy Perimeter WAF / ACL Block',
      actionText: 'Push IP 198.51.100.44 to Edge Blacklist',
      description: 'Synchronize edge firewall rule across AWS WAF and Cloudflare demo ingress.',
      completed: false
    },
    {
      id: 'step-4',
      label: 'Rotate API Key & Service Account Secrets',
      actionText: 'Rotate svc_demo_cicd Credential',
      description: 'Generate fresh synthetic key pair in AWS Secrets Manager and deprecate previous version.',
      completed: false
    },
    {
      id: 'step-5',
      label: 'Close Incident & Generate Post-Mortem',
      actionText: 'Mark Incident Resolved',
      description: 'Verify indicators are quiescent, restore healthy node baseline, and archive forensic artifacts.',
      completed: false
    }
  ]
};

export const INITIAL_COMPLIANCE_CONTROLS: ComplianceControl[] = [
  {
    id: 'ctrl-01',
    framework: 'NIST CSF 2.0',
    code: 'PR.AA-01',
    title: 'Identity and Credential Management',
    category: 'Protect',
    status: 'compliant',
    description: 'Identities are bound to credentials and asserted in interactions with authentication requirements proportional to the risk.',
    simulatedEvidence: '94.8% MFA adoption on all user accounts; SSO enforced with FIDO2 for cloud consoles.',
    lastAudited: '2026-10-20'
  },
  {
    id: 'ctrl-02',
    framework: 'NIST CSF 2.0',
    code: 'DE.CM-01',
    title: 'Continuous Network & Host Monitoring',
    category: 'Detect',
    status: 'compliant',
    description: 'Networks and host environments are continuously monitored to identify potential adverse cybersecurity events.',
    simulatedEvidence: 'Cyber Space eBPF agents streaming telemetry across 128 demo nodes with 99.98% uptime.',
    lastAudited: '2026-10-24'
  },
  {
    id: 'ctrl-03',
    framework: 'NIST CSF 2.0',
    code: 'RS.AN-03',
    title: 'Incident Analysis and Forensics',
    category: 'Respond',
    status: 'needs_review',
    description: 'Analysis is performed to determine the root cause, scope, and operational impact of detected incidents.',
    simulatedEvidence: 'Incident INC-2026-042 currently undergoing active simulated triage; containment playbook in progress.',
    lastAudited: 'Today (Automated)'
  },
  {
    id: 'ctrl-04',
    framework: 'SOC 2 Type II',
    code: 'CC6.1',
    title: 'Logical Access Security Controls',
    category: 'Security',
    status: 'compliant',
    description: 'The entity implements logical access security software, infrastructure, and architectures over protected information assets.',
    simulatedEvidence: 'Role-based access control (RBAC) enforced; automated quarterly access review workflow enabled.',
    lastAudited: '2026-10-15'
  },
  {
    id: 'ctrl-05',
    framework: 'SOC 2 Type II',
    code: 'CC7.2',
    title: 'Vulnerability Management & Timely Remediation',
    category: 'Protect',
    status: 'needs_review',
    description: 'Vulnerabilities are identified, evaluated against severity criteria, and resolved according to organizational SLAs.',
    simulatedEvidence: '1 critical CVE (CVE-2026-31901 simulated) pending container engine patch; SLA countdown active.',
    lastAudited: 'Today'
  },
  {
    id: 'ctrl-06',
    framework: 'ISO 27001:2022',
    code: 'A.8.8',
    title: 'Management of Technical Vulnerabilities',
    category: 'Protect',
    status: 'compliant',
    description: 'Information about technical vulnerabilities of information systems is obtained and evaluated in a timely manner.',
    simulatedEvidence: 'Daily CSPM and container vulnerability scanners automated in CI/CD pipeline.',
    lastAudited: '2026-10-22'
  },
  {
    id: 'ctrl-07',
    framework: 'ISO 27001:2022',
    code: 'A.5.24',
    title: 'Information Security Incident Management Planning',
    category: 'Respond',
    status: 'compliant',
    description: 'The organization plans and prepares for managing information security incidents by defining roles and procedures.',
    simulatedEvidence: 'Automated playbooks for cloud isolation, token revocation, and forensic artifact preservation.',
    lastAudited: '2026-10-18'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-101',
    timestamp: '14:23:40 UTC',
    actor: 'Cyber Space AI Engine (Automated)',
    eventType: 'Security Alert',
    target: 'prod-iam-vault.demo.internal',
    details: 'Flagged Critical Alert NEX-8821: STS AssumeRole anomaly from RFC 5737 demo IP 198.51.100.44',
    severity: 'critical'
  },
  {
    id: 'aud-102',
    timestamp: '14:22:15 UTC',
    actor: 'Network Sensor (eBPF)',
    eventType: 'Security Alert',
    target: 'k8s-worker-node-04.prod',
    details: 'High-frequency telemetry spike detected to synthetic C2 sinkhole domain beacon.c2-demo.test',
    severity: 'critical'
  },
  {
    id: 'aud-103',
    timestamp: '14:18:02 UTC',
    actor: 'Elena Vance (Analyst)',
    eventType: 'User Inspection',
    target: 'workstation-mac-eng-42',
    details: 'Opened endpoint forensic timeline; verified browser download sandbox interception',
    severity: 'info'
  },
  {
    id: 'aud-104',
    timestamp: '14:05:30 UTC',
    actor: 'Automated Posture Engine',
    eventType: 'Policy Toggle',
    target: 'Zero-Trust Gatekeeper',
    details: 'Enabled strict FIDO2 requirement for all production AWS administrative logins',
    severity: 'info'
  },
  {
    id: 'aud-105',
    timestamp: '13:58:12 UTC',
    actor: 'Security Operations Lead',
    eventType: 'Scenario Loaded',
    target: 'Dashboard Environment',
    details: 'Initialized demo baseline: Cloud IAM Anomaly & Privilege Escalation scenario',
    severity: 'info'
  }
];

export const MAP_PULSES = [
  { id: 'p1', x: 230, y: 140, label: 'US-East (AWS)', severity: 'critical', count: 12, target: 'prod-iam-vault' },
  { id: 'p2', x: 190, y: 160, label: 'US-West (K8s)', severity: 'critical', count: 8, target: 'k8s-node-04' },
  { id: 'p3', x: 480, y: 130, label: 'EU-Central (DB)', severity: 'medium', count: 3, target: 'aurora-cluster' },
  { id: 'p4', x: 740, y: 180, label: 'AP-East (Gateway)', severity: 'low', count: 1, target: 'edge-api' },
  { id: 'p5', x: 620, y: 220, label: 'IN-South (Corporate)', severity: 'high', count: 4, target: 'corp-ad' }
];

export const MAP_ARCS = [
  { id: 'a1', from: { x: 120, y: 180 }, to: { x: 230, y: 140 }, color: '#f43f5e', type: 'STS AssumeRole Abuse' },
  { id: 'a2', from: { x: 580, y: 110 }, to: { x: 190, y: 160 }, color: '#f43f5e', type: 'C2 Beaconing (Simulated)' },
  { id: 'a3', from: { x: 800, y: 260 }, to: { x: 480, y: 130 }, color: '#f59e0b', type: 'SQL Brute-Force Probe' },
  { id: 'a4', from: { x: 300, y: 310 }, to: { x: 740, y: 180 }, color: '#06b6d4', type: 'API Rate Scan' }
];
