import React from 'react';
import { useTheme } from '../theme/ThemeContext';

const DarkModeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        padding: '8px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        color: isDark ? '#ffffff' : '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {isDark ? '🌙' : '☀️'}
      <span style={{ fontSize: '0.9rem' }}>{isDark ? '' : ''}</span>
    </button>
  );
};

export default DarkModeToggle;
