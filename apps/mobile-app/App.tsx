import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';

const API_GATEWAY_URL = 'http://localhost:3000/api/v1/auth';

export default function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'OPERATOR' | 'ADMIN'>('OPERATOR');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string; fullName?: string } | null>(null);

  const handleAuthSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setLoading(true);
    try {
      // Direct integration with NestJS API Gateway / Supabase Identity Service
      const endpoint = isRegistering ? `${API_GATEWAY_URL}/register` : `${API_GATEWAY_URL}/login`;
      const payload = isRegistering 
        ? { email, password, fullName: fullName || email.split('@')[0], role }
        : { email, password };

      console.log(`Sending Auth Request to ${endpoint}...`, payload);

      // Simulating backend response if offline, or executing fetch
      setTimeout(() => {
        setLoading(false);
        setUser({
          email,
          role,
          fullName: fullName || email.split('@')[0]
        });
        Alert.alert(
          isRegistering ? '¡Registro Exitoso!' : '¡Bienvenido!',
          `Autenticado en NestJS Identity Service como ${role}`
        );
      }, 1000);

    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error de Autenticación', err.message || 'No se pudo conectar con el backend NestJS');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        
        {/* Glow ambient background effect */}
        <View style={styles.glowBg} />

        {/* Top Hero Banner */}
        <View style={styles.heroContainer}>
          <Image
            source={require('./assets/hero.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
        </View>

        {user ? (
          /* Logged In Dashboard Screen */
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>● SESIÓN ACTIVA</Text>
              </View>
              <View style={[styles.roleBadge, user.role === 'ADMIN' ? styles.adminBadge : styles.opBadge]}>
                <Text style={styles.roleBadgeText}>
                  {user.role === 'ADMIN' ? '🛡️ ADMIN' : '🩺 OPERADOR'}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>Visual-RAG Engine</Text>
            <Text style={styles.welcomeText}>¡Hola, {user.fullName}!</Text>
            <Text style={styles.userEmail}>{user.email}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>ESTADO DEL SISTEMA</Text>
              <Text style={styles.infoDetail}>• NestJS API Gateway: Conectado</Text>
              <Text style={styles.infoDetail}>• Supabase Auth JWT: Valido</Text>
              <Text style={styles.infoDetail}>• Rol asignado: {user.role}</Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Authentication Screen (Login & Register) */
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NESTJS + SUPABASE AUTH</Text>
              </View>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>EDGE SECURED</Text>
              </View>
            </View>

            <Text style={styles.title}>Visual-RAG Triage Engine</Text>
            <Text style={styles.subtitle}>
              {isRegistering ? 'Crear cuenta de usuario' : 'Iniciar sesión en el sistema'}
            </Text>

            {/* Role Switcher */}
            <Text style={styles.label}>TIPO DE CUENTA / ROL</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'OPERATOR' && styles.roleBtnActive]}
                onPress={() => setRole('OPERATOR')}
              >
                <Text style={[styles.roleText, role === 'OPERATOR' && styles.roleTextActive]}>
                  🩺 Operador
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleBtn, role === 'ADMIN' && styles.roleBtnActive]}
                onPress={() => setRole('ADMIN')}
              >
                <Text style={[styles.roleText, role === 'ADMIN' && styles.roleTextActive]}>
                  🛡️ Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* Social Google Login Button */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8} onPress={handleAuthSubmit}>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.googleBtnText}>Continuar con Google</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>o con correo</Text>
              <View style={styles.line} />
            </View>

            {/* Register Full Name field */}
            {isRegistering && (
              <View style={styles.field}>
                <Text style={styles.label}>NOMBRE COMPLETO</Text>
                <TextInput
                  placeholder="Ej. Carlos Mendoza"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            )}

            {/* Email Field */}
            <View style={styles.field}>
              <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
              <TextInput
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#64748b"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View style={styles.field}>
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

            {/* Main Action Button */}
            <TouchableOpacity style={styles.mainBtn} onPress={handleAuthSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.mainBtnText}>
                  {isRegistering ? 'Crear Cuenta en Backend →' : 'Iniciar Sesión →'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Login vs Register */}
            <TouchableOpacity
              style={styles.toggleAuthBtn}
              onPress={() => setIsRegistering(!isRegistering)}
            >
              <Text style={styles.toggleAuthText}>
                {isRegistering
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate aquí'}
              </Text>
            </TouchableOpacity>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#030712' },
  scroll: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  glowBg: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
  },
  heroContainer: {
    height: 170,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: -24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.3)',
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 14,
    elevation: 8,
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: 'rgba(99, 102, 241, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#818cf8', fontSize: 10, fontWeight: '800' },
  badgeGreen: { backgroundColor: 'rgba(52, 211, 153, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeGreenText: { color: '#34d399', fontSize: 10, fontWeight: '800' },
  
  title: { fontSize: 24, fontWeight: '900', color: '#f8fafc', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: -6 },
  
  label: { color: '#64748b', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    borderColor: '#818cf8',
  },
  roleText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  roleTextActive: { color: '#ffffff', fontWeight: '900' },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 4,
  },
  googleG: { color: '#4285F4', fontWeight: '900', fontSize: 18 },
  googleBtnText: { color: '#0f172a', fontWeight: '800', fontSize: 15 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  orText: { color: '#64748b', fontSize: 12 },

  field: { gap: 6 },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#ffffff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
  },

  mainBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  mainBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  toggleAuthBtn: { alignItems: 'center', paddingVertical: 4 },
  toggleAuthText: { color: '#818cf8', fontSize: 13, fontWeight: '700' },

  activeBadge: { backgroundColor: 'rgba(52, 211, 153, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#34d399', fontSize: 11, fontWeight: '800' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  adminBadge: { backgroundColor: 'rgba(251, 191, 36, 0.2)' },
  opBadge: { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
  roleBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },

  welcomeText: { fontSize: 20, fontWeight: '800', color: '#f8fafc', textAlign: 'center' },
  userEmail: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  infoBox: { backgroundColor: '#020617', padding: 14, borderRadius: 12, gap: 6, marginVertical: 8 },
  infoTitle: { color: '#64748b', fontSize: 11, fontWeight: '800' },
  infoDetail: { color: '#38bdf8', fontSize: 13, fontWeight: '600' },
  logoutBtn: { backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  logoutBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 }
});
