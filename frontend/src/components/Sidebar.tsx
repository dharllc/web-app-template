// File: frontend/src/components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { useTheme, theme } from '../theme/ThemeContext';
import { Session } from '../types/session';

interface SidebarProps {
  onSessionSelect?: (sessionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSessionSelect }) => {
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sessions`);
        const data = await response.json();
        setSessions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = (sessionId: string) => {
    setActiveSessionId(sessionId);
    onSessionSelect?.(sessionId);
  };

  return (
    <div style={{
      width: '250px',
      height: '100%',
      background: currentTheme.sidebar,
      borderRight: `1px solid ${currentTheme.border}`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${currentTheme.border}`
      }}>
        <button
          style={{
            width: '100%',
            padding: '10px',
            background: currentTheme.primary,
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
          onClick={() => console.log('New Session')}
        >
          New Session
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {loading ? (
          <div style={{ 
            padding: '20px', 
            color: currentTheme.textSecondary,
            textAlign: 'center' 
          }}>
            Loading sessions...
          </div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              style={{
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '6px',
                background: activeSessionId === session.id ? currentTheme.surfaceHover : currentTheme.surface,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
              onClick={() => handleSessionClick(session.id)}
            >
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.text,
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {session.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: currentTheme.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  Progress: {session.progress}%
                </div>
                <div style={{ 
                  flexShrink: 0,
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {session.status === 'completed' ? '✓' : '⋯'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;