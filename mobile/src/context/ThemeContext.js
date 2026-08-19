import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const lightTheme = {
  isDark: false,
  bg: '#F8FAFC',
  card: '#FFFFFF',
  cardSub: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  primary: '#0D9488',
  primaryBg: '#CCFBF1',
  primaryText: '#0D9488',
  inputBg: '#F8FAFC',
  inputBorder: '#CBD5E1',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerText: '#DC2626',
  success: '#10B981',
  successBg: '#F0FDF4',
  successText: '#16A34A',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  warningText: '#D97706',
  bottomBar: '#FFFFFF',
  headerBg: '#FFFFFF',
  statusBarStyle: 'dark-content',
};

export const darkTheme = {
  isDark: true,
  bg: '#0B132B',
  card: '#1E293B',
  cardSub: '#162032',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  border: '#334155',
  primary: '#2DD4BF',
  primaryBg: '#134E4A',
  primaryText: '#2DD4BF',
  inputBg: '#0F172A',
  inputBorder: '#334155',
  danger: '#F87171',
  dangerBg: '#451A1A',
  dangerText: '#FCA5A5',
  success: '#34D399',
  successBg: '#064E3B',
  successText: '#6EE7B7',
  warning: '#FBBF24',
  warningBg: '#451A03',
  warningText: '#FDE68A',
  bottomBar: '#0F172A',
  headerBg: '#0F172A',
  statusBarStyle: 'light-content',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
