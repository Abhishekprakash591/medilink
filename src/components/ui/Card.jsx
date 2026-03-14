import React from 'react';

export const Card = ({ children, className = '', padding = 'var(--spacing-6)', style = {}, ...props }) => {
  return (
    <div 
      className={`card ${className}`} 
      style={{
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        padding: padding,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
