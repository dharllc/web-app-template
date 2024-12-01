import React from 'react';
import { useTheme, theme } from '../theme/ThemeContext';

interface Option {
  id: string;
  icon: string;
  label: string;
}

const Sidebar: React.FC = () => {
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;

  const options: Option[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'help', icon: '❓', label: 'Help' },
  ];

  return (
    <div style={{
      width: '200px',
      height: '100%',
      background: currentTheme.sidebar,
      borderRight: `1px solid ${currentTheme.border}`,
      padding: '20px 0',
      color: currentTheme.text
    }}>
      <nav>
        {options.map(option => (
          <div
            key={option.id}
            className="sidebar-option"
            style={{
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              color: currentTheme.text
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{option.icon}</span>
            <span>{option.label}</span>
          </div>
        ))}
      </nav>
      <style>
        {`
          .sidebar-option:hover {
            background: ${currentTheme.surfaceHover};
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
