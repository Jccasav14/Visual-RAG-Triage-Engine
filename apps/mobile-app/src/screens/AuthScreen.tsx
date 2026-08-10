import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Card, Button, ThemeColors } from '@visual-rag/ui-components';

export const AuthScreen: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.center}>
      <Card style={styles.card}>
        <Text style={styles.title}>Visual-RAG Auth</Text>
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Login with Supabase" onPress={onLoginSuccess} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: ThemeColors.textPrimary, textAlign: 'center' },
  input: { backgroundColor: '#1e293b', color: '#fff', padding: 12, borderRadius: 8 }
});
