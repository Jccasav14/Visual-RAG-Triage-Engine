import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, ThemeColors, SeverityIndicator } from '@visual-rag/ui-components';
import { CameraCapture } from '../components/CameraCapture';
import { ActionPlanViewer } from '../components/ActionPlanViewer';

export const TriageScreen: React.FC = () => {
  const [actionPlan, setActionPlan] = useState<any>(null);

  const handleCapture = () => {
    setActionPlan({
      summary: 'Edge Visual Evaluation Complete. Immediate Action Plan Available.',
      recommendedSteps: [
        { stepNumber: 1, actionTitle: 'Isolate Component', description: 'Power down and flag hardware unit.', urgency: 'IMMEDIATE' }
      ]
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edge Triage Scanner</Text>
      {!actionPlan ? (
        <Card>
          <CameraCapture onCapture={handleCapture} />
        </Card>
      ) : (
        <ActionPlanViewer plan={actionPlan} onReset={() => setActionPlan(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', color: ThemeColors.textPrimary }
});
