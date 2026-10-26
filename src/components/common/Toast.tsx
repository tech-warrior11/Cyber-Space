import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSOC();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = 'var(--cyan-primary)';
        let borderColor = 'var(--border-medium)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'var(--emerald-success)';
          borderColor = 'rgba(16, 185, 129, 0.4)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'var(--amber-warning)';
          borderColor = 'rgba(245, 158, 11, 0.4)';
        } else if (toast.type === 'critical') {
          Icon = XCircle;
          iconColor = 'var(--crimson-critical)';
          borderColor = 'rgba(244, 63, 94, 0.4)';
        }

        return (
          <div
            key={toast.id}
            className="toast-item"
            style={{ borderColor }}
          >
            <Icon size={18} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
