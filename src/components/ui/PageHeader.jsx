import React from 'react';

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: 'var(--spacing-6)'
    }}>
      <div>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)', 
          margin: '0 0 var(--spacing-1) 0' 
        }}>
          {title}
        </h1>
        {description && (
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)', 
            margin: 0 
          }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
