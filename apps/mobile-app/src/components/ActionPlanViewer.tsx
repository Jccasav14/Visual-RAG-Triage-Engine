import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, ThemeColors, Badge } from './ui';

export const ActionPlanViewer: React.FC<{ plan: any; onReset: () => void }> = ({ plan, onReset }) => (
  <Card style={styles.card}>
    <Badge label="AI Action Plan" />
    <Text style={styles.summary}>{plan.summary}</Text>
    {plan.recommendedSteps.map((step: any) => (
      <View key={step.stepNumber} style={styles.step}>
        <Text style={styles.stepTitle}>Step {step.stepNumber}: {step.actionTitle}</Text>
        <Text style={styles.stepDesc}>{step.description}</Text>
      </View>
    ))}
    <Button title="New Assessment" onPress={onReset} variant="secondary" />
  </Card>
);

const styles = StyleSheet.create({
  card: { gap: 12 },
  summary: { fontSize: 16, fontWeight: 'bold', color: ThemeColors.textPrimary },
  step: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8 },
  stepTitle: { fontWeight: 'bold', color: ThemeColors.primary },
  stepDesc: { color: ThemeColors.textSecondary, fontSize: 14 }
});
