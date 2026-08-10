import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card, ThemeColors, SeverityIndicator } from '../components/ui';

const MOCK_HISTORY = [
  { id: 'tkt_101', date: '2026-08-09', severity: 'CRITICAL', label: 'Wound Disruption' },
  { id: 'tkt_102', date: '2026-08-08', severity: 'LOW', label: 'Routine Inspection' },
];

export const HistoryScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.heading}>Triage Audit Log</Text>
    <FlatList
      data={MOCK_HISTORY}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.label}</Text>
            <SeverityIndicator level={item.severity} />
          </View>
          <Text style={styles.date}>{item.date} • ID: {item.id}</Text>
        </Card>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', color: ThemeColors.textPrimary },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: ThemeColors.textPrimary },
  date: { color: ThemeColors.textSecondary, marginTop: 4 }
});
