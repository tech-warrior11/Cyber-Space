import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { Terminal, Pause, Play } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  const { recentTickerEvents, isTickerPaused, toggleTickerPause, playSynthBeep } = useSOC();

  return (
    <div
      className="glass-panel"
      style={{
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <Terminal size={14} color="var(--cyan-primary)" />
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Live Telemetry Stream
        </span>
      </div>

      <div style={{ width: '1px', height: '14px', background: 'var(--border-medium)', flexShrink: 0 }}></div>

      {/* Marquee Event Ticker */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: '12px'
        }}
      >
        <span className="mono" style={{ color: 'var(--cyan-hover)' }}>
          [{(new Date().toISOString().substring(11, 19))}]
        </span>{' '}
        <span style={{ color: 'var(--text-main)' }}>
          {recentTickerEvents[0] || 'Awaiting next synthetic flow pulse...'}
        </span>
      </div>

      {/* Pause/Play control */}
      <button
        onClick={() => {
          toggleTickerPause();
          playSynthBeep('click');
        }}
        className="btn btn-secondary btn-sm"
        style={{ padding: '3px 8px', flexShrink: 0 }}
        title={isTickerPaused ? 'Resume live simulation ticker' : 'Pause ticker'}
      >
        {isTickerPaused ? <Play size={12} color="var(--emerald-success)" /> : <Pause size={12} color="var(--text-muted)" />}
        <span style={{ fontSize: '11px' }}>{isTickerPaused ? 'Resume' : 'Pause'}</span>
      </button>
    </div>
  );
};
