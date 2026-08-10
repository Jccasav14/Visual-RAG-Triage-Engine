import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

export const ThemeColors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  background: '#0f172a',
  cardBg: 'rgba(30, 41, 59, 0.7)',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  critical: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6'
};

export const Badge: React.FC<{ label: string; color?: string }> = ({ label, color = ThemeColors.primary }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const Card: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const Button: React.FC<{ title: string; onPress: () => void; variant?: 'primary' | 'secondary' }> = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity
    style={[styles.btn, variant === 'secondary' ? styles.secondaryBtn : styles.primaryBtn]}
    onPress={onPress}
  >
    <Text style={styles.btnText}>{title}</Text>
  </TouchableOpacity>
);

export const SeverityIndicator: React.FC<{ level: string }> = ({ level }) => {
  let color = ThemeColors.info;
  if (level === 'CRITICAL') color = ThemeColors.critical;
  if (level === 'HIGH') color = ThemeColors.warning;

  return (
    <View style={[styles.severityBox, { borderColor: color }]}>
      <Text style={[styles.severityText, { color }]}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  btn: { padding: 14, borderRadius: 12, alignItems: 'center' },
  primaryBtn: { backgroundColor: ThemeColors.primary },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: ThemeColors.primary },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  severityBox: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  severityText: { fontWeight: 'bold', fontSize: 12 }
});
