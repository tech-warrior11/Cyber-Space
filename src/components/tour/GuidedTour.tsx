import React from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  Shield,
  Radio,
  Server,
  Flame,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';

interface TourSlide {
  title: string;
  badge: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  description: string;
  targetTab?: 'overview' | 'threats' | 'assets' | 'incident' | 'identity';
  tips: string[];
}

export const GuidedTour: React.FC = () => {
  const { isTourOpen, tourStep, closeTour, nextTourStep, prevTourStep, setActiveTab, playSynthBeep } = useSOC();

  if (!isTourOpen) return null;

  const slides: TourSlide[] = [
    {
      title: 'Welcome to CYBER SPACE',
      badge: 'Step 1 of 5 • Overview',
      icon: Shield,
      description: 'CYBER SPACE is an enterprise-grade Security Operations Center (SOC) simulation engineered for portfolio demonstration. It features real-time synthetic telemetry, incident triage, and Zero-Trust architecture.',
      targetTab: 'overview',
      tips: [
        'Notice the Security Posture Index (0-100) dynamically reacting to open alerts and policy toggles.',
        'All telemetry uses synthetic datasets and RFC 5737 reserved demo IP blocks.',
        'Switch between 3 pre-configured attack scenarios anytime using the scenario dropdown.'
      ]
    },
    {
      title: 'Global Threat Activity Vector Map',
      badge: 'Step 2 of 5 • Threat Telemetry',
      icon: Radio,
      description: 'The self-contained SVG map visualizes real-time synthetic threat vectors streaming into enterprise cloud availability zones and perimeter load balancers.',
      targetTab: 'overview',
      tips: [
        'Click on any glowing telemetry pulse (e.g. US-East AWS) to inspect inbound vectors.',
        'Filter vectors by category: STS Abuse, C2 Beaconing, or Port Scans.',
        'Zero external map tiles or remote fonts are downloaded — it executes 100% locally.'
      ]
    },
    {
      title: 'Threat Feed & Forensic Triage Drawer',
      badge: 'Step 3 of 5 • Threat Intelligence',
      icon: Radio,
      description: 'Examine detailed synthetic detections with confidence scores, MITRE ATT&CK techniques, forensic timelines, and Indicators of Compromise (IOCs).',
      targetTab: 'threats',
      tips: [
        'Click any alert in the table to slide out the forensic inspection drawer.',
        'Directly update status to "Investigating", "Contained", or "Resolved".',
        'Inspect mapped MITRE tactics and synthetic cryptographic hashes.'
      ]
    },
    {
      title: 'Asset Inventory & Simulated Host Containment',
      badge: 'Step 4 of 5 • Attack Surface',
      icon: Server,
      description: 'Track compute instances, Kubernetes clusters, database pools, and workstation endpoints with live risk indices and agent telemetry heartbeats.',
      targetTab: 'assets',
      tips: [
        'Click the "Isolate" button on any asset to simulate instant network quarantine.',
        'Watch the asset status change to ISOLATED and notice corresponding audit log entries.',
        'Filter assets by environment (Production, Staging, Corporate) or risk index.'
      ]
    },
    {
      title: 'Incident Command & Zero-Trust Governance',
      badge: 'Step 5 of 5 • Response & Policies',
      icon: Flame,
      description: 'Take command of active incidents by sequentially executing simulated containment playbooks and customizing conditional access policies.',
      targetTab: 'incident',
      tips: [
        'Execute playbook steps one-by-one: Isolate Pod, Invalidate STS, Block IP, Rotate Secrets.',
        'Head over to Identity & Zero-Trust to toggle conditional access rules and watch the posture score adjust.',
        'Export immutable audit records as JSON or CSV directly to your local computer.'
      ]
    }
  ];

  const currentSlide = slides[tourStep] || slides[0];
  const Icon = currentSlide.icon;
  const isLast = tourStep === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      closeTour();
      playSynthBeep('success');
    } else {
      nextTourStep();
      const nextSlide = slides[tourStep + 1];
      if (nextSlide?.targetTab) {
        setActiveTab(nextSlide.targetTab);
      }
    }
  };

  const handlePrev = () => {
    prevTourStep();
    const prevSlide = slides[tourStep - 1];
    if (prevSlide?.targetTab) {
      setActiveTab(prevSlide.targetTab);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeTour}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ padding: '28px', maxWidth: '580px', position: 'relative' }}
      >
        {/* Close Button */}
        <button
          onClick={closeTour}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Step Indicator Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--cyan-dim)',
              border: '1px solid var(--cyan-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={20} color="var(--cyan-primary)" />
          </div>
          <div>
            <span className="badge badge-info mono" style={{ fontSize: '10px' }}>
              {currentSlide.badge}
            </span>
            <h3 style={{ fontSize: '18px', color: '#ffffff', marginTop: '2px' }}>
              {currentSlide.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
          {currentSlide.description}
        </p>

        {/* Key Tour Takeaways */}
        <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: '8px', padding: '14px 16px', border: '1px solid var(--border-medium)', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cyan-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Interactive Highlights
          </div>
          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-main)' }}>
            {currentSlide.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === tourStep ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === tourStep ? 'var(--cyan-primary)' : 'var(--border-medium)',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeTour}
            className="btn btn-secondary btn-sm"
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {tourStep > 0 && (
              <button
                onClick={handlePrev}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 14px' }}
            >
              <span>{isLast ? 'Start Exploring' : 'Next Step'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
