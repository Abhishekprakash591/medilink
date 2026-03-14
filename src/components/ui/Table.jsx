import React from 'react';

export const Table = ({ columns, data, keyExtractor, emptyMessage = 'No data available', onRowClick }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-lg)', backgroundColor: 'var(--surface-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr 
                key={keyExtractor ? keyExtractor(row) : i} 
                onClick={() => onRowClick && onRowClick(row)}
                style={{ 
                  borderBottom: '1px solid var(--border-color)', 
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => onRowClick && (e.currentTarget.style.backgroundColor = 'var(--background-color)')}
                onMouseOut={(e) => onRowClick && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {columns.map((col, j) => (
                  <td key={j} style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
