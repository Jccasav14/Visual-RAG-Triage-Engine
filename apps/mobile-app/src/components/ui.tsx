import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

export const ThemeColors = {
  background: '#030712',      // Rich obsidian dark
  surface: '#0f172a',         // Deep slate card
  surfaceElevated: '#1e293b', // Elevated card
  border: 'rgba(99, 102, 241, 0.25)', // Glowing indigo border
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  
  primary: '#6366f1',         // Indigo glow
  primaryBright: '#818cf8',   // Bright indigo text
  accent: '#a855f7',          // Electric purple accent
  
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  critical: '#f43f5e',        // Vivid rose red
  criticalGlow: 'rgba(244, 63, 94, 0.2)',
  warning: '#fbbf24',         // Bright amber
  warningGlow: 'rgba(251, 191, 36, 0.2)',
  success: '#34d399',         // Neon emerald green
  successGlow: 'rgba(52, 211, 153, 0.2)',
  info: '#38bdf8',            // Sky blue
};

export const Badge: React.FC<{ label: string; color?: string; variant?: 'glow' | 'solid' }> = ({
  label,
  color = ThemeColors.primaryBright,
  variant = 'glow'
}) => (
  <View style={[
    styles.badge,
    variant === 'glow' 
      ? { backgroundColor: 'rgba(99, 102, 241, 0.15)', borderColor: color, borderWidth: 1 }
      : { backgroundColor: color }
  ]}>
    <Text style={[styles.badgeText, { color }]}>{label.toUpperCase()}</Text>
  </View>
);

export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle; glow?: boolean }> = ({ children, style, glow = false }) => (
  <View style={[styles.card, glow && styles.cardGlow, style]}>
    {children}
  </View>
);

export const Button: React.FC<{ title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'accent' | 'danger' }> = ({
  title,
  onPress,
  variant = 'primary'
}) => {
  let btnStyle: ViewStyle = styles.primaryBtn;
  let textStyle: TextStyle = styles.btnTextPrimary;

  if (variant === 'secondary') {
    btnStyle = styles.secondaryBtn;
    textStyle = styles.btnTextSecondary;
  } else if (variant === 'accent') {
    btnStyle = styles.accentBtn;
    textStyle = styles.btnTextPrimary;
  } else if (variant === 'danger') {
    btnStyle = styles.dangerBtn;
    textStyle = styles.btnTextPrimary;
  }

  return (
    <TouchableOpacity style={[styles.btn, btnStyle]} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.btnText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const SeverityIndicator: React.FC<{ level: string }> = ({ level }) => {
  let color = ThemeColors.info;
  let bgGlow = 'rgba(56, 189, 248, 0.15)';
  if (level === 'CRITICAL') { color = ThemeColors.critical; bgGlow = ThemeColors.criticalGlow; }
  if (level === 'HIGH') { color = ThemeColors.warning; bgGlow = ThemeColors.warningGlow; }
  if (level === 'LOW') { color = ThemeColors.success; bgGlow = ThemeColors.successGlow; }

  return (
    <View style={[styles.severityBox, { borderColor: color, backgroundColor: bgGlow }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.severityText, { color }]}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: ThemeColors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGlow: {
    borderColor: ThemeColors.border,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  btn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: ThemeColors.primary,
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  accentBtn: {
    backgroundColor: ThemeColors.accent,
  },
  dangerBtn: {
    backgroundColor: ThemeColors.critical,
  },
  btnText: { fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  btnTextPrimary: { color: '#ffffff' },
  btnTextSecondary: { color: ThemeColors.textPrimary },
  severityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  severityText: { fontWeight: '800', fontSize: 12, letterSpacing: 0.5 }
});
