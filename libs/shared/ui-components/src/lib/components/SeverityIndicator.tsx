import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

export const SeverityIndicator: React.FC<{ level: string }> = ({ level }) => {
  let color = ThemeColors.info;
  if (level === 'CRITICAL') color = ThemeColors.critical;
  if (level === 'HIGH') color = ThemeColors.warning;

  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  text: { fontWeight: 'bold', fontSize: 12 }
});
