import React from 'react';
import Card from './Card';

export const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card padding="var(--spacing-4)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', margin: '0 0 var(--spacing-1) 0' }}>
            {title}
          </p>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {value}
          </h4>
          {trend && (
            <div style={{ marginTop: 'var(--spacing-2)', fontSize: '0.75rem', color: trend.positive ? 'var(--success-color)' : 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{trend.positive ? '↑' : '↓'} {trend.value}</span>
              <span style={{ color: 'var(--text-secondary)' }}>from yesterday</span>
            </div>
          )}
        </div>
        {Icon && (
          <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--background-color)', borderRadius: 'var(--border-radius-md)', color: 'var(--primary-color)' }}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
