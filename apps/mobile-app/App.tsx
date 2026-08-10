import React, { Component, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { AuthScreen, UserSession, WarmTheme } from './src/screens/AuthScreen';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.toString() };
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Visual-RAG Error Recovery</Text>
            <Text style={styles.errorText}>{this.state.error}</Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={() => this.setState({ hasError: false })}>
              <Text style={styles.logoutBtnText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [session, setSession] = useState<UserSession | null>(null);

  const handleLogout = () => {
    setSession(null);
    Alert.alert('Sesión Cerrada', 'Has salido de tu cuenta correctamente.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#18181b" />
      {session ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
          {/* Dashboard View after successful Auth */}
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>● AUTENTICADO CON {session.authMethod.toUpperCase()}</Text>
              </View>
              <View style={[styles.roleBadge, session.role === 'ADMIN' ? styles.adminBadge : styles.opBadge]}>
                <Text style={styles.roleBadgeText}>
                  {session.role === 'ADMIN' ? '🛡️ ADMIN' : '🩺 OPERADOR'}
                </Text>
              </View>
            </View>

            <Text style={styles.welcomeTitle}>¡Bienvenido, {session.fullName}!</Text>
            <Text style={styles.userEmail}>{session.email}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>DETALLES DE LA SESIÓN</Text>
              <Text style={styles.infoDetail}>• Método: {session.authMethod === 'google' ? 'Google OAuth 2.0' : 'Supabase Auth Email'}</Text>
              <Text style={styles.infoDetail}>• Rol Asignado: {session.role}</Text>
              <Text style={styles.infoDetail}>• Estado: Activo en PostgreSQL/Supabase</Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <AuthScreen onAuthSuccess={(newSession) => setSession(newSession)} />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: WarmTheme.bg },
  scroll: { flex: 1 },
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  
  card: {
    backgroundColor: WarmTheme.card,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: WarmTheme.border,
    gap: 16,
    elevation: 8,
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#10b981', fontSize: 10, fontWeight: '800' },
  
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  adminBadge: { backgroundColor: 'rgba(249, 115, 22, 0.2)' },
  opBadge: { backgroundColor: 'rgba(234, 88, 12, 0.2)' },
  roleBadgeText: { color: WarmTheme.textPrimary, fontSize: 11, fontWeight: '800' },

  welcomeTitle: { fontSize: 24, fontWeight: '900', color: WarmTheme.textPrimary, textAlign: 'center' },
  userEmail: { fontSize: 14, color: WarmTheme.textMuted, textAlign: 'center', marginTop: -8 },

  infoBox: { backgroundColor: '#18181b', padding: 16, borderRadius: 14, gap: 6 },
  infoTitle: { color: WarmTheme.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  infoDetail: { color: WarmTheme.accent, fontSize: 13, fontWeight: '600' },

  logoutBtn: { backgroundColor: '#dc2626', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  logoutBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },

  errorBox: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', gap: 16 },
  errorTitle: { color: '#ef4444', fontSize: 20, fontWeight: 'bold' },
  errorText: { color: '#94a3b8', textAlign: 'center', fontSize: 14 }
});
