// File: frontend/src/App.tsx
import React, { useState, useCallback } from 'react';
import './App.css';
import ConfigStatus from './components/ConfigStatus';
import Sidebar from './components/Sidebar';
import SessionView from './components/SessionView';
import DarkModeToggle from './components/DarkModeToggle';
import { ThemeProvider, useTheme, theme } from './theme/ThemeContext';
import { Session } from './types/session';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSessionCreated = useCallback((session: Session) => {
    setActiveSessionId(session.id);
    setRefreshTrigger(prev => prev + 1); // Trigger sidebar refresh
  }, []);

  const handleNewSession = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  return (
    <div className="App" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: currentTheme.background,
      color: currentTheme.text
    }}>
      <header style={{ 
        background: currentTheme.header, 
        padding: '12px 20px',
        borderBottom: `1px solid ${currentTheme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Speech Processor</h1>
        <DarkModeToggle />
      </header>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar 
          onSessionSelect={setActiveSessionId} 
          onNewSession={handleNewSession}
          refreshTrigger={refreshTrigger}
        />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <SessionView 
            sessionId={activeSessionId} 
            onSessionCreated={handleSessionCreated}
          />
        </main>
      </div>
      <ConfigStatus />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;