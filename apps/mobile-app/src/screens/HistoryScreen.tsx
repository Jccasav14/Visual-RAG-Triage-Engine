import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, ThemeColors, SeverityIndicator, Badge } from '../components/ui';

const MOCK_HISTORY = [
  { id: 'tkt_987654', date: '2026-08-10 14:15', severity: 'CRITICAL', label: 'Post-Op Wound Disruption', status: 'COMPLETED' },
  { id: 'tkt_987653', date: '2026-08-09 18:30', severity: 'HIGH', label: 'Hardware Degradation Anomaly', status: 'COMPLETED' },
  { id: 'tkt_987652', date: '2026-08-08 09:12', severity: 'LOW', label: 'Routine Post-Evaluation', status: 'COMPLETED' },
];

export const HistoryScreen: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.heading}>Triage Audit History</Text>
      <Badge label="Elasticsearch Index" color={ThemeColors.info} />
    </View>
    <FlatList
      data={MOCK_HISTORY}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.label}</Text>
            <SeverityIndicator level={item.severity} />
          </View>
          <View style={styles.subRow}>
            <Text style={styles.date}>ID: {item.id} • {item.date}</Text>
            <Badge label={item.status} color={ThemeColors.success} variant="glow" />
          </View>
        </Card>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, backgroundColor: ThemeColors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '900', color: ThemeColors.textPrimary, letterSpacing: -0.5 },
  list: { gap: 12, paddingBottom: 40 },
  card: { gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  title: { fontSize: 16, fontWeight: '800', color: ThemeColors.textPrimary, flex: 1, marginRight: 8 },
  date: { color: ThemeColors.textMuted, fontSize: 12, fontWeight: '600' }
});
