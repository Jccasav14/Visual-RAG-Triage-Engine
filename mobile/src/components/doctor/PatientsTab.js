import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Users,
  User,
  UserPlus,
  UserCheck,
  Search,
  RefreshCw,
  FileText,
  Trash2,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const PatientsTab = ({
  user,
  assignedPatients,
  loadingPatients,
  selectedPatient,
  onSelectPatientForEdit,
  onRefresh,
  onAssignSuccess,
}) => {
  const { theme } = useTheme();
  const [searchFilter, setSearchFilter] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [modalResults, setModalResults] = useState([]);
  const [searchingModal, setSearchingModal] = useState(false);

  const filteredPatients = assignedPatients.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    const nameMatch = (p.fullName || '').toLowerCase().includes(q);
    const emailMatch = (p.email || '').toLowerCase().includes(q);
    const cedulaMatch = (p.cedula || '').toLowerCase().includes(q);
    return nameMatch || emailMatch || cedulaMatch;
  });

  const handleOpenAssignModal = async () => {
    setModalSearchText('');
    setModalResults([]);
    setShowAssignModal(true);
    setSearchingModal(true);
    try {
      const allPatients = await api.searchPatients('');
      setModalResults(Array.isArray(allPatients) ? allPatients : []);
    } catch {
      setModalResults([]);
    } finally {
      setSearchingModal(false);
    }
  };

  const handleSearchModalPatients = async (text) => {
    setModalSearchText(text);
    setSearchingModal(true);
    try {
      const res = await api.searchPatients(text.trim());
      setModalResults(Array.isArray(res) ? res : []);
    } catch {
      setModalResults([]);
    } finally {
      setSearchingModal(false);
    }
  };

  const handleLinkPatient = async (patientId) => {
    try {
      await api.assignPatientToDoctor(user.id, patientId);
      Alert.alert('Paciente Vinculado', 'El paciente ha sido vinculado exitosamente a tu lista.');
      setShowAssignModal(false);
      if (onAssignSuccess) onAssignSuccess();
    } catch {
      Alert.alert('Error', 'No se pudo vincular el paciente.');
    }
  };

  const handleUnassignPatient = (patient) => {
    Alert.alert(
      'Desvincular Paciente',
      `¿Deseas remover a ${patient.fullName || patient.email} de tus pacientes asignados?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.unassignPatient(user.id, patient.id);
              if (onRefresh) onRefresh();
            } catch {
              Alert.alert('Error', 'No se pudo desvincular el paciente.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionHeading, { color: theme.text }]}>Mis Pacientes</Text>
        <TouchableOpacity
          style={[styles.assignNewBtn, { backgroundColor: theme.primary }]}
          onPress={handleOpenAssignModal}
        >
          <UserPlus size={16} color="#FFFFFF" />
          <Text style={styles.assignNewBtnText}>+ Asignar</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}>
        <Search size={18} color={theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar por nombre, cédula o correo..."
          placeholderTextColor={theme.textMuted}
          value={searchFilter}
          onChangeText={setSearchFilter}