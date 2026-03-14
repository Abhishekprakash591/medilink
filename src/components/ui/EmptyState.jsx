import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({ 
  title = "No data found", 
  description = "Get started by creating a new entry.", 
  icon: Icon = PackageOpen,
  action 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--spacing-8)',
      textAlign: 'center',
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px dashed var(--border-color)'
    }}>
      <div style={{ 
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-3)',
        opacity: 0.6
      }}>
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        margin: '0 0 var(--spacing-1) 0'
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: '0.875rem', 
        color: 'var(--text-secondary)',
        margin: '0 0 var(--spacing-4) 0',
        maxWidth: '300px'
      }}>
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
