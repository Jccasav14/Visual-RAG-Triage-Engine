import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ThemeColors } from '@visual-rag/ui-components';

export const PlanDetailScreen: React.FC<{ plan: any }> = ({ plan }) => (
  <Card style={styles.card}>
    <Text style={styles.title}>Detailed Action Plan</Text>
    <Text style={styles.desc}>{plan.summary}</Text>
  </Card>
);

const styles = StyleSheet.create({
  card: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: ThemeColors.textPrimary },
  desc: { color: ThemeColors.textSecondary, marginTop: 8 }
});
