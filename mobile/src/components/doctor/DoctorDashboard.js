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