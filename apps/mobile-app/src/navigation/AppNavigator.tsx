import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AuthScreen } from '../screens/AuthScreen';
import { TriageScreen } from '../screens/TriageScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { Button, ThemeColors, Badge } from '../components/ui';

export const AppNavigator: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'triage' | 'history'>('triage');

  if (!userRole) {
    return <AuthScreen onLoginSuccess={(role) => setUserRole(role)} />;
  }

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Visual-RAG Engine</Text>
          <Badge
            label={userRole === 'ADMIN' ? '🛡️ ROL ADMINISTRADOR' : '🩺 OPERADOR DE TRIAJE'}
            color={userRole === 'ADMIN' ? ThemeColors.warning : ThemeColors.primaryBright}
          />
        </View>
        <Button title="Salir" onPress={() => setUserRole(null)} variant="secondary" />
      </View>

      <View style={styles.content}>
        {currentTab === 'triage' ? <TriageScreen /> : <HistoryScreen />}
      </View>

      {/* Glassmorphic Tab Bar */}
      <View style={styles.tabBar}>
        <Button
          title="📷 Escáner Triaje"
          onPress={() => setCurrentTab('triage')}
          variant={currentTab === 'triage' ? 'primary' : 'secondary'}
        />
        <Button
          title={userRole === 'ADMIN' ? "📊 Auditoría & Logs" : "📜 Historial"}
          onPress={() => setCurrentTab('history')}
          variant={currentTab === 'history' ? 'primary' : 'secondary'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ThemeColors.background },
  topHeader: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: ThemeColors.surface,
  },
  headerTitleBox: { gap: 4 },
  headerTitle: { color: ThemeColors.textPrimary, fontWeight: '900', fontSize: 16, letterSpacing: -0.3 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 14,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: ThemeColors.surface,
  }
});
