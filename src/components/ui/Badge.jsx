import React from 'react';

export const Badge = ({ children, variant = 'info', className = '', ...props }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#d1fae5', text: '#065f46' }; // Tailwind emerald
      case 'warning':
        return { bg: '#fef3c7', text: '#92400e' }; // Tailwind amber
      case 'danger':
        return { bg: '#fee2e2', text: '#991b1b' }; // Tailwind red
      case 'info':
      default:
        return { bg: '#e0e7ff', text: '#3730a3' }; // Tailwind indigo
    }
  };

  const colors = getColors();

  return (
    <span 
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.text,
        whiteSpace: 'nowrap'
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
