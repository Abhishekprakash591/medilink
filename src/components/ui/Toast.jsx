import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ 
  message, 
  variant = 'info', 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const variants = {
    success: { bg: '#ecfdf5', border: '#10b981', icon: <CheckCircle2 size={20} color="#10b981" /> },
    error: { bg: '#fef2f2', border: '#ef4444', icon: <AlertCircle size={20} color="#ef4444" /> },
    info: { bg: '#eff6ff', border: '#3b82f6', icon: <Info size={20} color="#3b82f6" /> },
  };

  const current = variants[variant] || variants.info;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--spacing-6)',
      right: 'var(--spacing-6)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      padding: 'var(--spacing-3) var(--spacing-4)',
      backgroundColor: current.bg,
      borderLeft: `4px solid ${current.border}`,
      borderRadius: 'var(--border-radius-md)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      minWidth: '300px',
      animation: 'slideUp 0.3s ease-out'
    }}>
      {current.icon}
      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>
        {message}
      </p>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
        <X size={16} />
      </button>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
