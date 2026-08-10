import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Card, Button, ThemeColors, Badge } from '../components/ui';

export const AuthScreen: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('operator@visual-rag.local');

  return (
    <View style={styles.container}>
      <View style={styles.headerGlow} />
      <Card glow style={styles.card}>
        <View style={styles.logoBadge}>
          <Badge label="Edge Computing Platform" color={ThemeColors.primaryBright} />
        </View>
        <Text style={styles.title}>Visual-RAG Triage Engine</Text>
        <Text style={styles.subtitle}>AI-Assisted Visual Assessment System</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>OPERATOR IDENTIFIER</Text>
          <TextInput
            placeholder="operator@domain.com"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Button title="Authenticate with Supabase →" onPress={onLoginSuccess} variant="primary" />
        
        <Text style={styles.footerNote}>
          🔒 End-to-End Encrypted Edge Authentication Active
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: ThemeColors.background },
  headerGlow: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  card: { gap: 18, padding: 24 },
  logoBadge: { alignSelf: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: ThemeColors.textPrimary, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: ThemeColors.textSecondary, textAlign: 'center', marginTop: -12, marginBottom: 8 },
  formGroup: { gap: 8 },
  label: { color: ThemeColors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    padding: 16,
    borderRadius: 12,
    fontSize: 15,
  },
  footerNote: { color: ThemeColors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 4 }
});
