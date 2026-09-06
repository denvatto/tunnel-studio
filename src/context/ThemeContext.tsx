import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('tunnel-studio-theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
  } catch (err) {
    console.warn('Storage unavailable:', err);
  }
  return 'dark'; // Dark is strictly default
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('tunnel-studio-theme', newTheme);
      }
    } catch (err) {
      console.warn('Storage unavailable:', err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.style.backgroundColor = '#090a0f';
        document.body.style.color = '#f5f5f5';
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', '#090a0f');
        }
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', '#f8fafc');
        }
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
