import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tunnel-studio-theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark'; // Default is dark as requested
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tunnel-studio-theme', theme);
      const root = document.documentElement;
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');

      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.classList.remove('bg-slate-50', 'text-slate-900');
        document.body.classList.add('bg-[#090a0f]', 'text-neutral-100');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', '#090a0f');
        }
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        document.body.classList.remove('bg-[#090a0f]', 'text-neutral-100');
        document.body.classList.add('bg-slate-50', 'text-slate-900');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', '#f8fafc');
        }
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
