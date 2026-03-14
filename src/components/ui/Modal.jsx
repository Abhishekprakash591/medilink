import React from 'react';
import { X } from 'lucide-react';
import Card from './Card';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: 'var(--spacing-4)'
    }} onClick={onClose}>
      <Card 
        padding="0"
        style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: 'var(--spacing-4) var(--spacing-6)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{title}</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: 'var(--spacing-6)', overflowY: 'auto' }}>
          {children}
        </div>
        
        {footer && (
          <div style={{ 
            padding: 'var(--spacing-4) var(--spacing-6)',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)',
            borderBottomLeftRadius: 'var(--border-radius-lg)',
            borderBottomRightRadius: 'var(--border-radius-lg)'
          }}>
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Modal;
