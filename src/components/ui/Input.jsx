import React from 'react';

export const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  wrapperClassName = '',
  required,
  ...props 
}, ref) => {
  return (
    <div className={wrapperClassName} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--danger-color)' }}>*</span>}
        </label>
      )}
      <input 
        ref={ref}
        className={className}
        style={{
          padding: 'var(--spacing-2) var(--spacing-3)',
          borderRadius: 'var(--border-radius-md)',
          border: `1px solid ${error ? 'var(--danger-color)' : 'var(--border-color)'}`,
          backgroundColor: 'var(--surface-color)',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          width: '100%',
          boxSizing: 'border-box'
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--danger-color)' }}>{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
