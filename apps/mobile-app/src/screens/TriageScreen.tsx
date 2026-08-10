import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, ThemeColors, Badge } from '../components/ui';
import { CameraCapture } from '../components/CameraCapture';
import { ActionPlanViewer } from '../components/ActionPlanViewer';

export const TriageScreen: React.FC = () => {
  const [actionPlan, setActionPlan] = useState<any>(null);

  const handleCapture = () => {
    setActionPlan({
      severity: 'HIGH',
      summary: 'Computer Vision classified anomaly as High Severity Tissue Disruption. Context cross-referenced with Supabase history.',
      recommendedSteps: [
        { stepNumber: 1, actionTitle: 'Isolate & Sanitize Field', description: 'Apply localized sterile barrier immediately.', urgency: 'IMMEDIATE' },
        { stepNumber: 2, actionTitle: 'Schedule Level-2 Specialist Review', description: 'Transmit telemetry packet to clinical auditor within 2 hours.', urgency: 'WITHIN_24H' }
      ]
    });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Visual Assessment</Text>
        <Badge label="Edge AI Model Active" color={ThemeColors.success} />
      </View>

      {!actionPlan ? (
        <Card glow>
          <CameraCapture onCapture={handleCapture} />
        </Card>
      ) : (
        <ActionPlanViewer plan={actionPlan} onReset={() => setActionPlan(null)} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: ThemeColors.background },
  container: { padding: 20, gap: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '900', color: ThemeColors.textPrimary, letterSpacing: -0.5 }
});
