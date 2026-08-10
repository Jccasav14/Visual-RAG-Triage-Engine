import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthScreen } from '../screens/AuthScreen';
import { TriageScreen } from '../screens/TriageScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { Button } from '../components/ui';

export const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState<'triage' | 'history'>('triage');

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentTab === 'triage' ? <TriageScreen /> : <HistoryScreen />}
      </View>
      <View style={styles.tabBar}>
        <Button title="Triage Camera" onPress={() => setCurrentTab('triage')} variant={currentTab === 'triage' ? 'primary' : 'secondary'} />
        <Button title="History Log" onPress={() => setCurrentTab('history')} variant={currentTab === 'history' ? 'primary' : 'secondary'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, borderTopWidth: 1, borderColor: '#334155' }
});
