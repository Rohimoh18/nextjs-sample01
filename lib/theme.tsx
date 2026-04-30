'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'dark' | 'light' | 'midnight' | 'ocean' | 'rose';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  description: string;
  preview: { bg: string; sidebar: string; accent: string };
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'dark',
    label: 'Dark',
    description: 'Default deep-space dark theme',
    preview: { bg: '#0A0E1A', sidebar: '#111827', accent: '#6366F1' },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Pure black OLED-friendly palette',
    preview: { bg: '#000000', sidebar: '#0D0D0D', accent: '#818CF8' },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Deep teal-blue tones',
    preview: { bg: '#061520', sidebar: '#0A2030', accent: '#06B6D4' },
  },
  {
    id: 'rose',
    label: 'Rose',
    description: 'Warm rose & violet accents',
    preview: { bg: '#120A0E', sidebar: '#1A0F14', accent: '#F43F5E' },
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Clean light mode for bright environments',
    preview: { bg: '#F8FAFC', sidebar: '#FFFFFF', accent: '#6366F1' },
  },
];

interface ThemeCtx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('rose');

  // On mount, read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mypay-theme') as ThemeId | null;
    if (saved && THEMES.find(t => t.id === saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem('mypay-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
