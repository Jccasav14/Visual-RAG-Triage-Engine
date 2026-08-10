import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

interface BadgeProps {
  label: string;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = ThemeColors.primary }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  text: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});
