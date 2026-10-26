import React from 'react';

interface PostureGaugeProps {
  score: number;
  size?: number;
  label?: string;
  sublabel?: string;
}

export const PostureGauge: React.FC<PostureGaugeProps> = ({
  score,
  size = 180,
  label = 'Security Posture',
  sublabel
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // We'll draw 270 degrees arc (from 135 deg to 405 deg)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  // Determine color theme based on score
  let strokeColor = 'var(--emerald-success)';
  let glowColor = 'rgba(16, 185, 129, 0.3)';
  let statusText = 'Optimal Posture';

  if (score < 60) {
    strokeColor = 'var(--crimson-critical)';
    glowColor = 'rgba(244, 63, 94, 0.35)';
    statusText = 'Elevated Risk';
  } else if (score < 80) {
    strokeColor = 'var(--amber-warning)';
    glowColor = 'rgba(245, 158, 11, 0.3)';
    statusText = 'Moderate Exposure';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(135deg)', overflow: 'visible' }}
      >
        <defs>
          <filter id={`glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-surface-elevated)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Foreground active arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#glow-${size})`}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease'
          }}
        />
      </svg>

      {/* Center Label and Score */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: size > 150 ? '38px' : '26px',
            fontWeight: 800,
            lineHeight: 1,
            color: '#ffffff',
            textShadow: `0 0 12px ${glowColor}`
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: '11px', color: strokeColor, fontWeight: 600, marginTop: '4px' }}>
          {statusText}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {sublabel || label}
        </span>
      </div>
    </div>
  );
};
