import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const theme = {
  light: {
    background: '#ffffff',
    surface: '#f5f5f5',
    surfaceHover: '#e8e8e8',
    border: '#e0e0e0',
    text: '#1a1a1a',
    textSecondary: '#666666',
    primary: '#4caf50',
    primaryHover: '#45a049',
    header: '#f5f5f5',
    sidebar: '#f5f5f5',
  },
  dark: {
    background: '#121212',
    surface: '#1a1a1a',
    surfaceHover: '#252525',
    border: '#333333',
    text: '#ffffff',
    textSecondary: '#888888',
    primary: '#4caf50',
    primaryHover: '#45a049',
    header: '#1a1a1a',
    sidebar: '#1a1a1a',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
