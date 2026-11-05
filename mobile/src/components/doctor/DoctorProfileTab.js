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
  Stethoscope,
  LogOut,
  Save,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export const DoctorProfileTab = ({
  user,
  fullName,
  setFullName,
  specialty,
  setSpecialty,
  licenseNumber,
  setLicenseNumber,
  hospital,
  setHospital,
  phone,
  setPhone,
  savingProfile,
  profileMsg,
  onSaveProfile,
  onLogout,
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionHeading, { color: theme.text }]}>Perfil y Configuración</Text>

      {/* 1. DOCTOR HERO CARD */}
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.primaryBg }]}>
          <Stethoscope size={32} color={theme.primary} />
        </View>
        <Text style={[styles.profileName, { color: theme.text }]}>
          {user?.fullName ? `Dr. ${user.fullName}` : user?.email}
        </Text>
        <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: theme.primaryBg }]}>
          <Text style={[styles.roleBadgeText, { color: theme.primary }]}>MÉDICO CIRUJANO TRATANTE</Text>
        </View>

        <View style={styles.doctorPillsRow}>
          <View style={[styles.quickInfoPill, { backgroundColor: theme.cardSub }]}>
            <Text style={[styles.quickInfoText, { color: theme.text }]}>Reg: {licenseNumber || 'MSP'}</Text>
          </View>
          {!!hospital && (
            <View style={[styles.quickInfoPill, { backgroundColor: theme.cardSub }]}>
              <Text style={[styles.quickInfoText, { color: theme.text }]}>{hospital}</Text>
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

      {/* 3. DATOS PROFESIONALES */}
      <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.formCardTitle, { color: theme.text }]}>Datos Profesionales</Text>

        <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre y Apellidos:</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Dr. Nombre Apellido"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Especialidad Médica:</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          value={specialty}
          onChangeText={setSpecialty}
          placeholder="Ej. Cirugía General y Laparoscópica"
          placeholderTextColor={theme.textMuted}
        />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Registro MSP / Licencia:</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              placeholder="MSP-XXXXXX"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Teléfono Consultorio:</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+593 99..."
              placeholderTextColor={theme.textMuted}