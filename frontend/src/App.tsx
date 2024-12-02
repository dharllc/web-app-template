// File: frontend/src/App.tsx
import React from 'react';
import './App.css';
import ConfigStatus from './components/ConfigStatus';
import Sidebar from './components/Sidebar';
import DarkModeToggle from './components/DarkModeToggle';
import { ThemeProvider, useTheme, theme } from './theme/ThemeContext';
import { Outlet, useNavigate } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const currentTheme = isDark ? theme.dark : theme.light;
  const navigate = useNavigate();

  const handleNewSession = () => {
    navigate('/');
  };

  const handleSessionSelect = (sessionId: string | null) => {
    if (sessionId) {
      navigate(`/sessions/${sessionId}`);
    } else {
      navigate('/');
    }
  };

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
          onSessionSelect={handleSessionSelect} 
          onNewSession={handleNewSession}
        />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
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