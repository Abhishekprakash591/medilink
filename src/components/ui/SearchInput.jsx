import React from 'react';
import { Search } from 'lucide-react';
import Input from './Input';

export const SearchInput = ({ placeholder = 'Search...', ...props }) => {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-secondary)' }}>
        <Search size={18} />
      </div>
      <Input
        placeholder={placeholder}
        style={{
          paddingLeft: '2.5rem',
          paddingTop: 'var(--spacing-2)',
          paddingBottom: 'var(--spacing-2)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--surface-color)',
          width: '100%',
          outline: 'none',
        }}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
