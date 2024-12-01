import React, { useEffect, useState } from 'react';
import { useTheme, theme } from '../theme/ThemeContext';

interface HealthData {
  status: string;
  port: number;
  frontend_url: string;
}

const ConfigStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const backendUrl = `${process.env.REACT_APP_BACKEND_URL}/health`;
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to backend');
        console.error('Error:', err);
      }
    };

    checkHealth();
  }, []);

  return (
    <div style={{ 
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      padding: '8px 12px',
      background: currentTheme.surface,
      borderRadius: '6px',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: currentTheme.text,
      boxShadow: `0 2px 4px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}`,
      zIndex: 1000
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: health?.status === 'healthy' ? currentTheme.primary : '#ff6b6b',
        boxShadow: health?.status === 'healthy' ? `0 0 8px ${currentTheme.primary}` : '0 0 8px #ff6b6b'
      }} />
      <span>Backend: {error ? 'Error' : (health?.status === 'healthy' ? 'Connected' : 'Disconnected')}</span>
    </div>
  );
};

export default ConfigStatus;
