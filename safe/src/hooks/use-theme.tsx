/**
 * Theme state is shared across the app so the profile toggle can switch
 * between light and dark modes at runtime.
 */

import React, { createContext, useContext, useState } from 'react';
import { Colors } from '@/constants/theme';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  theme: typeof Colors[ThemeMode];
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: Colors[mode], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };

export function useTheme() {
  const context = useContext(ThemeContext);
  return context?.theme ?? Colors.light;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  return context ?? {
    mode: 'light' as const,
    theme: Colors.light,
    toggleTheme: () => {},
  };
}
