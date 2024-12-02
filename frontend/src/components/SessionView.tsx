// File: frontend/src/components/SessionView.tsx
import React, { useEffect, useState } from 'react';
import { useTheme, theme } from '../theme/ThemeContext';
import { Session } from '../types/session';

interface SessionViewProps {
  sessionId: string | null;
}

const SessionView: React.FC<SessionViewProps> = ({ sessionId }) => {
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setSession(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sessions/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: currentTheme.textSecondary
      }}>
        Select a session to view its details
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: currentTheme.textSecondary
      }}>
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: currentTheme.textSecondary
      }}>
        Session not found
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Session Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        background: currentTheme.surface,
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>{session.title}</h2>
        <div style={{
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '14px',
          background: session.status === 'completed' ? currentTheme.primary : currentTheme.surface,
          color: session.status === 'completed' ? '#fff' : currentTheme.textSecondary,
          border: `1px solid ${session.status === 'completed' ? currentTheme.primary : currentTheme.border}`
        }}>
          {session.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>
      </div>

      {/* Progress */}
      <div style={{
        padding: '16px',
        background: currentTheme.surface,
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Progress</h3>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: currentTheme.surfaceHover,
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${session.progress}%`,
            height: '100%',
            background: currentTheme.primary,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          marginTop: '8px',
          fontSize: '14px',
          color: currentTheme.textSecondary,
          textAlign: 'right'
        }}>
          {session.progress}%
        </div>
      </div>

      {/* Input History */}
      <div style={{
        padding: '16px',
        background: currentTheme.surface,
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Input History</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {session.input.map((text, index) => (
            <div key={index} style={{
              padding: '12px',
              background: currentTheme.background,
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div style={{
        padding: '16px',
        background: currentTheme.surface,
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>AI Suggestions</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {session.suggestions.map((suggestion, index) => (
            <div key={index} style={{
              padding: '12px',
              background: currentTheme.background,
              borderRadius: '6px',
              fontSize: '14px',
              color: currentTheme.textSecondary
            }}>
              {suggestion}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div style={{
        padding: '16px',
        background: currentTheme.surface,
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Generated Output</h3>
        <div style={{
          padding: '16px',
          background: currentTheme.background,
          borderRadius: '6px',
          fontSize: '14px',
          whiteSpace: 'pre-wrap'
        }}>
          {session.output || 'No output generated yet'}
        </div>
      </div>
    </div>
  );
};

export default SessionView;