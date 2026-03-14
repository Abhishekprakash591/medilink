import React from 'react';
import '../../styles/globals.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: 'var(--border-radius-md)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    border: 'none',
    outline: 'none',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      ...( !disabled && !isLoading ? { ':hover': { backgroundColor: 'var(--primary-hover)' } } : {} )
    },
    secondary: {
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      backgroundColor: 'var(--danger-color)',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary-color)',
      border: '1px solid var(--primary-color)',
    }
  };

  const sizes = {
    sm: { padding: 'var(--spacing-2) var(--spacing-3)', fontSize: '0.875rem' },
    md: { padding: 'var(--spacing-2) var(--spacing-4)', fontSize: '1rem' },
    lg: { padding: 'var(--spacing-3) var(--spacing-6)', fontSize: '1.125rem' }
  };

  const style = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button style={style} disabled={disabled || isLoading} className={className} {...props}>
      {isLoading ? (
        <span style={{ marginRight: '8px', display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
