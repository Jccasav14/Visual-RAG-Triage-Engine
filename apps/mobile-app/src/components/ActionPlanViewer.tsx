import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, ThemeColors, Badge, SeverityIndicator } from './ui';

export const ActionPlanViewer: React.FC<{ plan: any; onReset: () => void }> = ({ plan, onReset }) => (
  <Card glow style={styles.container}>
    <View style={styles.headerRow}>
      <Badge label="AI RAG Action Plan" color={ThemeColors.primaryBright} />
      <SeverityIndicator level={plan.severity || 'HIGH'} />
    </View>

    <Text style={styles.summaryTitle}>Assessment Summary</Text>
    <Text style={styles.summaryText}>{plan.summary}</Text>

    <View style={styles.stepsContainer}>
      <Text style={styles.sectionHeader}>RECOMMENDED STEPS</Text>
      {plan.recommendedSteps.map((step: any) => (
        <View key={step.stepNumber} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepNum}>STEP {step.stepNumber}</Text>
            <Badge label={step.urgency} color={step.urgency === 'IMMEDIATE' ? ThemeColors.critical : ThemeColors.warning} variant="glow" />
          </View>
          <Text style={styles.actionTitle}>{step.actionTitle}</Text>
          <Text style={styles.stepDesc}>{step.description}</Text>
        </View>
      ))}
    </View>

    <View style={styles.footerBox}>
      <Text style={styles.disclaimer}>
        ⚠️ AI-Assisted RAG Output. Verify with domain supervisor.
      </Text>
      <Button title="← Run New Visual Assessment" onPress={onReset} variant="secondary" />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: { gap: 16, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: 18, fontWeight: '900', color: ThemeColors.textPrimary, marginTop: 4 },
  summaryText: { fontSize: 14, color: ThemeColors.textSecondary, lineHeight: 20 },
  stepsContainer: { gap: 12, marginTop: 8 },
  sectionHeader: { color: ThemeColors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  stepCard: {
    backgroundColor: '#020617',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepNum: { color: ThemeColors.primaryBright, fontWeight: '900', fontSize: 12, letterSpacing: 0.8 },
  actionTitle: { color: ThemeColors.textPrimary, fontSize: 16, fontWeight: '800' },
  stepDesc: { color: ThemeColors.textSecondary, fontSize: 13, lineHeight: 18 },
  footerBox: { gap: 12, marginTop: 8 },
  disclaimer: { color: ThemeColors.warning, fontSize: 11, fontWeight: '600', textAlign: 'center' }
});
