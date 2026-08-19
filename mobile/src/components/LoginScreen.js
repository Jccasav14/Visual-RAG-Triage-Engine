import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Heart,
  Lock,
  Mail,
  User,
  ShieldCheck,
  UserPlus,
  LogIn,
  CreditCard,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react-native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

export const LoginScreen = ({ onLoginSuccess }) => {
  const { theme } = useTheme();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [role, setRole] = useState('PATIENT'); // 'PATIENT' | 'DOCTOR'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor ingresa tu correo electrónico y contraseña.');
      return;
    }

    if (isRegisterMode) {
      if (!fullName.trim()) {
        Alert.alert('Nombre Requerido', 'Por favor ingresa tu nombre completo.');
        return;
      }
      if (!cedula.trim()) {
        Alert.alert('Cédula Requerida', 'Por favor ingresa tu número de cédula o DNI.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Contraseña Corta', 'La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        const data = await api.register({
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          role: role,
          cedula: cedula.trim(),
        });
        Alert.alert('Registro Exitoso', `Bienvenido ${data.user.fullName || data.user.email}. Tu cuenta ha sido creada.`);
        onLoginSuccess(data.user, data.token);
      } else {
        const data = await api.login(email.trim(), password.trim());
        onLoginSuccess(data.user, data.token);
      }
    } catch (err) {
      console.error('Auth error:', err);
      let msg = 'Error de conexión con el servidor. Verifica que los servicios estén activos.';
      if (err.response) {
        if (err.response.status === 401) {
          msg = 'Correo electrónico o contraseña incorrectos. Verifica tus credenciales.';
        } else if (err.response.status === 400) {
          msg = err.response.data?.message || 'Los datos ingresados no son válidos o el correo ya está registrado.';
        } else if (err.response.data?.message) {
          msg = typeof err.response.data.message === 'string' ? err.response.data.message : JSON.stringify(err.response.data.message);
        }
      }
      setErrorMsg(msg);
      Alert.alert('Error de Autenticación', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBg} translucent={false} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO HERO CENTRADO */}
          <View style={styles.heroBox}>
            <View style={[styles.logoCircle, { backgroundColor: theme.primaryBg }]}>
              <Heart size={32} color={theme.primary} />
            </View>
            <Text style={[styles.appTitle, { color: theme.text }]}>Visual RAG Postop</Text>
            <Text style={[styles.appSubtitle, { color: theme.textMuted }]}>
              Sistema de Monitoreo Clínico y Quirúrgico
            </Text>
          </View>

          {/* MAIN CARD */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* TABS SWITCHER */}
            <View style={[styles.tabSwitchContainer, { backgroundColor: theme.cardSub, borderColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.tabSwitchBtn, !isRegisterMode && { backgroundColor: theme.primary }]}
                onPress={() => {
                  setIsRegisterMode(false);
                  setErrorMsg('');
                }}
              >
                <LogIn size={16} color={!isRegisterMode ? '#FFFFFF' : theme.textMuted} />
                <Text style={[styles.tabSwitchText, { color: !isRegisterMode ? '#FFFFFF' : theme.textMuted }]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabSwitchBtn, isRegisterMode && { backgroundColor: theme.primary }]}
                onPress={() => {
                  setIsRegisterMode(true);
                  setErrorMsg('');
                }}
              >
                <UserPlus size={16} color={isRegisterMode ? '#FFFFFF' : theme.textMuted} />
                <Text style={[styles.tabSwitchText, { color: isRegisterMode ? '#FFFFFF' : theme.textMuted }]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </View>

            {/* REGISTER FIELDS */}
            {isRegisterMode && (
              <>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Tipo de Cuenta:</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      { borderColor: theme.primary, backgroundColor: role === 'PATIENT' ? theme.primary : theme.card },
                    ]}
                    onPress={() => setRole('PATIENT')}
                  >
                    <User size={16} color={role === 'PATIENT' ? '#FFFFFF' : theme.primary} />
                    <Text style={[styles.roleBtnText, { color: role === 'PATIENT' ? '#FFFFFF' : theme.primary }]}>
                      Paciente
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      { borderColor: theme.primary, backgroundColor: role === 'DOCTOR' ? theme.primary : theme.card },
                    ]}
                    onPress={() => setRole('DOCTOR')}
                  >
                    <ShieldCheck size={16} color={role === 'DOCTOR' ? '#FFFFFF' : theme.primary} />
                    <Text style={[styles.roleBtnText, { color: role === 'DOCTOR' ? '#FFFFFF' : theme.primary }]}>
                      Cirujano
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre Completo:</Text>
                <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                  <User size={16} color={theme.textMuted} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Ej: Juan Pérez"
                    placeholderTextColor={theme.textMuted}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <Text style={[styles.inputLabel, { color: theme.text }]}>Cédula / DNI:</Text>
                <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                  <CreditCard size={16} color={theme.textMuted} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Ej: 1751361054"
                    placeholderTextColor={theme.textMuted}
                    value={cedula}
                    onChangeText={setCedula}
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}

            {/* EMAIL */}
            <Text style={[styles.inputLabel, { color: theme.text }]}>Correo Electrónico:</Text>
            <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Mail size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD */}
            <Text style={[styles.inputLabel, { color: theme.text }]}>Contraseña:</Text>
            <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Lock size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <EyeOff size={18} color={theme.textMuted} /> : <Eye size={18} color={theme.textMuted} />}
              </TouchableOpacity>
            </View>

            {/* ERROR MESSAGE */}
            {!!errorMsg && (
              <View style={[styles.errorBox, { backgroundColor: theme.dangerBg, borderColor: theme.danger }]}>
                <AlertCircle size={16} color={theme.danger} />
                <Text style={[styles.errorText, { color: theme.dangerText }]}>{errorMsg}</Text>
              </View>
            )}

            {/* SUBMIT BUTTON */}
            <TouchableOpacity style={[styles.loginBtn, { backgroundColor: theme.primary }]} onPress={handleAuth} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {isRegisterMode ? <UserPlus size={16} color="#FFFFFF" /> : <LogIn size={16} color="#FFFFFF" />}
                  <Text style={styles.loginBtnText}>
                    {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },

  heroBox: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },

  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    maxWidth: 420,
  },

  tabSwitchContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
  },
  tabSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabSwitchText: {
    fontSize: 13,
    fontWeight: '700',
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  roleBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
    marginTop: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  eyeBtn: {
    padding: 6,
  },

  errorBox: {
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  loginBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
