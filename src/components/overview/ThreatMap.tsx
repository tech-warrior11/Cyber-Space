import React, { useState } from 'react';
import { MAP_PULSES, MAP_ARCS } from '../../data/mockData';
import { Shield, Eye, Filter, RefreshCw } from 'lucide-react';
import { useSOC } from '../../context/SOCContext';

export const ThreatMap: React.FC = () => {
  const { playSynthBeep, selectAsset, assets, setActiveTab } = useSOC();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeNode, setActiveNode] = useState<typeof MAP_PULSES[0] | null>(null);

  const filteredArcs = selectedFilter === 'all' 
    ? MAP_ARCS 
    : MAP_ARCS.filter(a => a.type.toLowerCase().includes(selectedFilter.toLowerCase()));

  const handleNodeClick = (node: typeof MAP_PULSES[0]) => {
    setActiveNode(node);
    playSynthBeep('click');
  };

  const handleInspectAsset = (targetName: string) => {
    const found = assets.find(a => a.name.includes(targetName));
    if (found) {
      selectAsset(found);
      setActiveTab('assets');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Map Header with Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '15px' }}>Global Synthetic Threat Telemetry Map</h3>
            <span className="badge badge-info mono" style={{ fontSize: '10px' }}>
              SELF-CONTAINED SVG
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Real-time simulated telemetry vectors across cloud availability zones and internal enterprise perimeter.
          </p>
        </div>

        {/* Vector Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color="var(--text-muted)" />
          {['all', 'STS Abuse', 'C2 Beaconing', 'Port Scan'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedFilter(cat);
                playSynthBeep('click');
              }}
              className={`btn btn-sm ${selectedFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div
        style={{
          position: 'relative',
          background: 'radial-gradient(ellipse at center, #0e172a 0%, #080d1a 100%)',
          borderRadius: '8px',
          border: '1px solid var(--border-medium)',
          overflow: 'hidden',
          minHeight: '340px'
        }}
      >
        <svg
          viewBox="0 0 960 420"
          style={{ width: '100%', height: '100%', display: 'block', minHeight: '340px' }}
          role="img"
          aria-label="Stylized world map with simulated cybersecurity threat vectors"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="soc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>

            {/* Linear gradients for threat arcs */}
            <linearGradient id="grad-crit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="grad-warn" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="960" height="420" fill="url(#soc-grid)" />

          {/* Stylized Continents Outlines */}
          <g fill="#14213d" stroke="#1d2e53" strokeWidth="1" opacity="0.85">
            {/* North America */}
            <path d="M 120 70 L 260 60 L 310 90 L 280 140 L 240 180 L 210 220 L 190 200 L 140 140 L 100 110 Z" />
            {/* South America */}
            <path d="M 230 220 L 290 240 L 320 290 L 290 370 L 250 380 L 230 300 Z" />
            {/* Europe */}
            <path d="M 440 80 L 530 75 L 560 120 L 500 145 L 450 140 L 440 100 Z" />
            {/* Africa */}
            <path d="M 450 160 L 540 160 L 570 230 L 540 330 L 490 340 L 460 250 Z" />
            {/* Asia */}
            <path d="M 550 70 L 780 65 L 830 140 L 760 210 L 670 200 L 610 130 Z" />
            {/* Oceania / Australia */}
            <path d="M 740 270 L 840 260 L 860 320 L 770 340 Z" />
          </g>

          {/* Longitude and Latitude guidelines */}
          <line x1="0" y1="210" x2="960" y2="210" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="4 4" />
          <line x1="480" y1="0" x2="480" y2="420" stroke="rgba(6, 182, 212, 0.15)" strokeDasharray="4 4" />

          {/* Animated Threat Vector Arcs */}
          {filteredArcs.map(arc => {
            const midX = (arc.from.x + arc.to.x) / 2;
            const midY = Math.min(arc.from.y, arc.to.y) - 50;
            const pathD = `M ${arc.from.x} ${arc.from.y} Q ${midX} ${midY} ${arc.to.x} ${arc.to.y}`;

            return (
              <g key={arc.id}>
                {/* Static arc trail */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.45"
                  strokeDasharray="4 4"
                />
                {/* Flowing pulse particle */}
                <circle r="3.5" fill={arc.color}>
                  <animateMotion
                    path={pathD}
                    dur="3s"
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                  />
                </circle>
              </g>
            );
          })}

          {/* Telemetry Nodes & Target Pulses */}
          {MAP_PULSES.map(node => {
            const isCrit = node.severity === 'critical';
            const isHigh = node.severity === 'high';
            const color = isCrit ? 'var(--crimson-critical)' : isHigh ? 'var(--amber-warning)' : 'var(--cyan-primary)';

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                aria-label={`Node ${node.label}, ${node.count} events`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') handleNodeClick(node);
                }}
              >
                {/* Concentric pulsing rings */}
                <circle cx={node.x} cy={node.y} r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="8;22" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={node.x} cy={node.y} r="6" fill={color} />
                <circle cx={node.x} cy={node.y} r="2" fill="#ffffff" />

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y - 12}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Telemetry Card Overlay */}
        {activeNode && (
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '14px',
              background: 'rgba(13, 20, 36, 0.95)',
              border: '1px solid var(--border-highlight)',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-md)',
              maxWidth: '320px',
              backdropFilter: 'blur(8px)',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>{activeNode.label}</span>
              <button
                onClick={() => setActiveNode(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Active Inbound Vectors: <strong style={{ color: 'var(--crimson-critical)' }}>{activeNode.count}</strong></div>
              <div>Target Demarcation: <span className="mono" style={{ color: 'var(--cyan-primary)' }}>{activeNode.target}</span></div>
              <div>Telemetry Mode: <span style={{ color: 'var(--emerald-success)' }}>eBPF Flow Log</span></div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => handleInspectAsset(activeNode.target)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '11px' }}
              >
                <Eye size={12} /> Inspect Asset in Inventory
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulsing-dot pulse-critical"></span> Critical Threat Vector
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulsing-dot pulse-warning"></span> Suspicious Probe
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulsing-dot pulse-info"></span> Benign Flow / Rate Limit
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={12} />
          <span>Dynamic Simulated Telemetry // Auto-refresh 3.5s</span>
        </div>
      </div>
    </div>
  );
};
