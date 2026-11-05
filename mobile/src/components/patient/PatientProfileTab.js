import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  User,
  LogOut,
  Save,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export const PatientProfileTab = ({
  user,
  fullName,
  setFullName,
  cedula,
  setCedula,
  phone,
  setPhone,
  bloodType,
  setBloodType,
  emergencyContact,
  setEmergencyContact,
  savingProfile,
  profileMsg,
  onSaveProfile,
  onLogout,
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeading, { color: theme.text }]}>Perfil y Configuración</Text>

      {/* 1. PATIENT HERO CARD */}
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.primaryBg }]}>
          <User size={32} color={theme.primary} />
        </View>
        <Text style={[styles.profileName, { color: theme.text }]}>{user?.fullName || user?.email}</Text>
        <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: theme.primaryBg }]}>
          <Text style={[styles.roleBadgeText, { color: theme.primary }]}>PACIENTE POSTOPERATORIO</Text>
        </View>

        <View style={styles.patientPillsRow}>
          <View style={[styles.quickInfoPill, { backgroundColor: theme.cardSub }]}>
            <Text style={[styles.quickInfoText, { color: theme.text }]}>Grupo: {bloodType || 'O+'}</Text>
          </View>
          {!!cedula && (
            <View style={[styles.quickInfoPill, { backgroundColor: theme.cardSub }]}>
              <Text style={[styles.quickInfoText, { color: theme.text }]}>CI: {cedula}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 2. MODO OSCURO / CLARO */}
      <View style={[styles.themeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {isDarkMode ? <Moon size={22} color="#FBBF24" /> : <Sun size={22} color="#0D9488" />}
          <View>
            <Text style={[styles.themeCardTitle, { color: theme.text }]}>Modo de Visualización</Text>
            <Text style={[styles.themeCardSub, { color: theme.textMuted }]}>
              {isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.themeSwitchPill, { backgroundColor: theme.primary }]}
          onPress={toggleTheme}
        >
          <Text style={styles.themeSwitchPillText}>Cambiar</Text>
        </TouchableOpacity>
      </View>

      {/* 3. DATOS CLÍNICOS */}
      <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.formCardTitle, { color: theme.text }]}>Datos Clínicos</Text>

        <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre Completo:</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nombre y Apellido"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Cédula / DNI:</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={cedula}
          onChangeText={setCedula}
          placeholder="Ej. 1751361054"
          placeholderTextColor={theme.textMuted}
          keyboardType="numeric"
        />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Tipo de Sangre:</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              value={bloodType}
              onChangeText={setBloodType}
              placeholder="Ej. O+, A+, B+"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Teléfono Móvil:</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+593 98..."
              placeholderTextColor={theme.textMuted}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Contacto de Emergencia:</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Ej. Carmen Casa (Madre) - 0987654321"
          placeholderTextColor={theme.textMuted}
        />

        <TouchableOpacity
          style={[styles.saveProfileBtn, { backgroundColor: theme.primary }]}
          onPress={onSaveProfile}
          disabled={savingProfile}
        >
          {savingProfile ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveProfileBtnText}>Guardar Datos Clínicos</Text>
            </View>
          )}
        </TouchableOpacity>

        {!!profileMsg && (
          <Text style={{ color: theme.success, marginTop: 8, fontWeight: '700', fontSize: 13 }}>
            {profileMsg}
          </Text>
        )}
      </View>

      {/* 4. CERRAR SESIÓN */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.danger }]}
        onPress={() => {
          Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: onLogout },
          ]);
        }}
      >
        <LogOut size={18} color="#FFFFFF" />
        <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  patientPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  quickInfoPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickInfoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginTop: 14,
  },
  themeCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  themeCardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  themeSwitchPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  themeSwitchPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginTop: 14,
  },
  formCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveProfileBtn: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

