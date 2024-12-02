// File: frontend/src/components/SessionView.tsx
import React, { useEffect, useState } from 'react';
import { useTheme, theme } from '../theme/ThemeContext';
import { Session } from '../types/session';
import { useParams, useNavigate } from 'react-router-dom';

interface SessionViewProps {
  sessionId?: string | null;
}

const SessionView: React.FC<SessionViewProps> = ({ sessionId: propSessionId }) => {
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();
  const sessionId = propSessionId ?? routeSessionId ?? null;
  
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!sessionId);
  const [title, setTitle] = useState('');
  const [isCreateButtonHovered, setIsCreateButtonHovered] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setSession(null);
        setIsEditing(true);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sessions/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');
        const data = await response.json();
        setSession(data);
        setTitle(data.title);
        setIsEditing(false);
      } catch (error) {
        console.error('Error fetching session:', error);
        navigate('/');  // Redirect to home on error
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

  const handleSessionCreated = async (newSession: Session) => {
    navigate(`/sessions/${newSession.id}`);
  };

  const createSession = async () => {
    if (title.trim()) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: title.trim() }),
        });

        if (!response.ok) throw new Error('Failed to create session');
        const newSession = await response.json();
        setSession(newSession);
        setIsEditing(false);
        handleSessionCreated(newSession);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }
  };

  const handleCreateSession = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await createSession();
    }
  };

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

  if (isEditing) {
    return (
      <div style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <h2 style={{ margin: 0, color: currentTheme.text }}>Create New Session</h2>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleCreateSession}
            placeholder="Enter your goal or task"
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '16px',
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`,
              background: currentTheme.surface,
              color: currentTheme.text,
              outline: 'none',
            }}
            autoFocus
          />
          <button
            onClick={createSession}
            disabled={!title.trim()}
            onMouseEnter={() => setIsCreateButtonHovered(true)}
            onMouseLeave={() => setIsCreateButtonHovered(false)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              background: title.trim() 
                ? (isCreateButtonHovered ? currentTheme.primaryHover : currentTheme.primary)
                : currentTheme.surface,
              color: title.trim() ? '#fff' : currentTheme.textSecondary,
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            Create
          </button>
        </div>
        <p style={{ 
          color: currentTheme.textSecondary,
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          Describe what you'd like to accomplish. For example: "Help me write a response to a client email about project delays"
        </p>
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