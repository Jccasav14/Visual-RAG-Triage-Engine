import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Users,
  FileText,
  User,
  Stethoscope,
} from 'lucide-react-native';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_BAR_HEIGHT } from '../../utils/clinicalUtils';

import { PatientsTab } from './PatientsTab';
import { RestrictionsTab } from './RestrictionsTab';
import { DoctorProfileTab } from './DoctorProfileTab';

export const DoctorDashboard = ({ user, token, onLogout, onUpdateUser }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('PATIENTS'); // 'PATIENTS' | 'RESTRICTIONS' | 'PROFILE'
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Doctor Profile Form
  const [fullName, setFullName] = useState(user.fullName || '');
  const [specialty, setSpecialty] = useState(user.specialty || 'Cirugía General y Laparoscópica');
  const [licenseNumber, setLicenseNumber] = useState(user.licenseNumber || 'MSP-178942-MED');
  const [hospital, setHospital] = useState(user.hospital || 'Hospital Metropolitano');
  const [phone, setPhone] = useState(user.phone || '+593 99 876 5432');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    loadAssignedPatients();
  }, [user.id]);

  const loadAssignedPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await api.getDoctorPatients(user.id);
      const list = Array.isArray(data) ? data : [];
      setAssignedPatients(list);
      if (list.length > 0 && !selectedPatient) {
        setSelectedPatient(list[0]);
      }
    } catch (err) {
      console.error('Error fetching doctor patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSelectPatientForEdit = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('RESTRICTIONS');
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const updated = await api.updateProfile(user.id, {
        fullName: fullName.trim(),
        specialty: specialty.trim(),
        licenseNumber: licenseNumber.trim(),
        hospital: hospital.trim(),
        phone: phone.trim(),
      });
      if (onUpdateUser) onUpdateUser(updated);
      setProfileMsg('Perfil actualizado correctamente.');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el perfil profesional.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBg} translucent={false} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconContainer, { backgroundColor: theme.primaryBg }]}>
            <Stethoscope size={20} color={theme.primary} />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.headerSubtitle, { color: theme.primary }]}>PORTAL MÉDICO</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
              {user.fullName ? `Dr. ${user.fullName}` : user.email}
            </Text>
          </View>
        </View>

        <View style={[styles.patientCountBadge, { backgroundColor: theme.primaryBg, borderColor: theme.border }]}>
          <Text style={[styles.patientCountText, { color: theme.primary }]}>
            {assignedPatients.length} Paciente{assignedPatients.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* BODY CONTENT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'PATIENTS' && (
            <PatientsTab
              user={user}
              assignedPatients={assignedPatients}
              loadingPatients={loadingPatients}
              selectedPatient={selectedPatient}
              onSelectPatientForEdit={handleSelectPatientForEdit}
              onRefresh={loadAssignedPatients}
              onAssignSuccess={loadAssignedPatients}
            />
          )}

          {activeTab === 'RESTRICTIONS' && (
            <RestrictionsTab
              token={token}
              selectedPatient={selectedPatient}
              assignedPatients={assignedPatients}
              onSelectPatient={setSelectedPatient}
            />
          )}

          {activeTab === 'PROFILE' && (
            <DoctorProfileTab
              user={user}
              fullName={fullName}
              setFullName={setFullName}
              specialty={specialty}
              setSpecialty={setSpecialty}
              licenseNumber={licenseNumber}
              setLicenseNumber={setLicenseNumber}
              hospital={hospital}
              setHospital={setHospital}
              phone={phone}
              setPhone={setPhone}
              savingProfile={savingProfile}
              profileMsg={profileMsg}
              onSaveProfile={handleSaveProfile}
              onLogout={onLogout}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('PATIENTS')}
          activeOpacity={0.7}
        >
          <Users size={22} color={activeTab === 'PATIENTS' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'PATIENTS' ? theme.primary : theme.textMuted }]}>
            Pacientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('RESTRICTIONS')}
          activeOpacity={0.7}
        >
          <FileText size={22} color={activeTab === 'RESTRICTIONS' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'RESTRICTIONS' ? theme.primary : theme.textMuted }]}>
            Ficha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('PROFILE')}
          activeOpacity={0.7}
        >
          <User size={22} color={activeTab === 'PROFILE' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'PROFILE' ? theme.primary : theme.textMuted }]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  patientCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  patientCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});

