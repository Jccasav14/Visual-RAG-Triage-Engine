import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Button, ThemeColors, Badge } from '../components/ui';

export const AuthScreen: React.FC<{ onLoginSuccess: (role: string) => void }> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'OPERATOR' | 'ADMIN'>('OPERATOR');

  const handleAuth = () => {
    onLoginSuccess(selectedRole);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      {/* Background Neon Glow */}
      <View style={styles.ambientGlow} />

      {/* Hero Header Graphic */}
      <View style={styles.heroHeaderContainer}>
        <Image
          source={require('../../assets/hero.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
      </View>

      {/* Auth Main Card */}
      <Card glow style={styles.card}>
        <View style={styles.badgeRow}>
          <Badge label="Supabase Auth & RBAC" color={ThemeColors.primaryBright} />
          <Badge label="Edge AI Secured" color={ThemeColors.success} variant="glow" />
        </View>

        <Text style={styles.title}>Visual-RAG Triage Engine</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Crear Nueva Cuenta de Usuario' : 'Iniciar Sesión en la Plataforma'}
        </Text>

        {/* Role Selector Tabs */}
        <View style={styles.roleContainer}>
          <Text style={styles.label}>SELECCIONAR ROL DE ACCESO</Text>
          <View style={styles.roleTabs}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.roleTab, selectedRole === 'OPERATOR' && styles.roleTabActive]}
              onPress={() => setSelectedRole('OPERATOR')}
            >
              <Text style={[styles.roleTabText, selectedRole === 'OPERATOR' && styles.roleTabTextActive]}>
                🩺 Operador de Triaje
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.roleTab, selectedRole === 'ADMIN' && styles.roleTabActive]}
              onPress={() => setSelectedRole('ADMIN')}
            >
              <Text style={[styles.roleTabText, selectedRole === 'ADMIN' && styles.roleTabTextActive]}>
                🛡️ Admin / Auditor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Google Login Button */}
        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85} onPress={handleAuth}>
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={styles.googleBtnText}>Continuar con Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o con correo electrónico</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email / Password Form Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <TextInput
            placeholder="usuario@visual-rag.com"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>CONTRASEÑA</Text>
          <TextInput
            placeholder="••••••••••••"
            placeholderTextColor="#64748b"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Auth Submit Button */}
        <Button
          title={isRegistering ? "Registrar Cuenta en Supabase →" : "Iniciar Sesión →"}
          onPress={handleAuth}
          variant="primary"
        />

        {/* Toggle Login / Register */}
        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.switchAuthTouch}
        >
          <Text style={styles.switchAuthText}>
            {isRegistering
              ? "¿Ya tienes cuenta? Inicia sesión aquí"
              : "¿No tienes cuenta? Regístrate aquí"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          🔒 Autenticación protegida por Supabase JWT & Edge Encryption
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: ThemeColors.background },
  content: { padding: 20, paddingTop: 10, paddingBottom: 40 },
  ambientGlow: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  heroHeaderContainer: {
    height: 180,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: -24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.35)',
  },
  card: { gap: 16, padding: 22 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: ThemeColors.textPrimary, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: ThemeColors.textSecondary, textAlign: 'center', marginTop: -8, marginBottom: 4 },
  
  roleContainer: { gap: 8, marginVertical: 4 },
  label: { color: ThemeColors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  roleTabs: { flexDirection: 'row', gap: 8 },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  roleTabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: ThemeColors.primaryBright,
  },
  roleTabText: { color: ThemeColors.textSecondary, fontSize: 12, fontWeight: '700' },
  roleTabTextActive: { color: '#ffffff', fontWeight: '900' },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
    marginTop: 4,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: { color: '#ffffff', fontWeight: '900', fontSize: 15 },
  googleBtnText: { color: '#0f172a', fontWeight: '800', fontSize: 15 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  dividerText: { color: ThemeColors.textMuted, fontSize: 12 },

  formGroup: { gap: 6 },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  switchAuthTouch: { paddingVertical: 6, alignItems: 'center' },
  switchAuthText: { color: ThemeColors.primaryBright, fontSize: 13, fontWeight: '700' },
  footerNote: { color: ThemeColors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 4 }
});
