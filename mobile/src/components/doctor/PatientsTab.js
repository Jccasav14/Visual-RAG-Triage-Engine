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
        />
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={{ padding: 6 }}>
            <RefreshCw size={16} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      {loadingPatients ? (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
      ) : filteredPatients.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Users size={40} color={theme.textMuted} />
          <Text style={[styles.emptyCardTitle, { color: theme.text }]}>Sin pacientes asignados</Text>
          <Text style={[styles.emptyCardSub, { color: theme.textMuted }]}>
            Toca "+ Asignar" para buscar pacientes registrados en el sistema y agregarlos a tu seguimiento.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12, marginTop: 14 }}>
          {filteredPatients.map((patient) => {
            const isSelected = selectedPatient?.id === patient.id;
            return (
              <View
                key={patient.id}
                style={[
                  styles.patientCard,
                  { backgroundColor: theme.card, borderColor: isSelected ? theme.primary : theme.border },
                  isSelected && { borderWidth: 2 },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.patientAvatar, { backgroundColor: theme.primaryBg }]}>
                    <User size={20} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.patientName, { color: theme.text }]}>
                      {patient.fullName || patient.email}
                    </Text>
                    <Text style={[styles.patientEmail, { color: theme.textMuted }]}>{patient.email}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                      {!!patient.cedula && (
                        <Text style={[styles.patientCedula, { color: theme.primary }]}>CI: {patient.cedula}</Text>
                      )}
                      {!!patient.bloodType && (
                        <Text style={[styles.patientBadge, { color: theme.textMuted }]}>
                          Grupo: {patient.bloodType}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={[styles.patientActionsRow, { borderTopColor: theme.cardSub }]}>
                  <TouchableOpacity
                    style={[styles.editFichaBtn, { backgroundColor: theme.primary }]}
                    onPress={() => onSelectPatientForEdit(patient)}
                  >
                    <FileText size={15} color="#FFFFFF" />
                    <Text style={styles.editFichaBtnText}>Ficha Postoperatoria</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.unassignBtn, { backgroundColor: theme.dangerBg }]}
                    onPress={() => handleUnassignPatient(patient)}
                  >
                    <Trash2 size={16} color={theme.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* MODAL ASIGNAR NUEVO PACIENTE */}
      <Modal visible={showAssignModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Asignar Paciente</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)} style={{ padding: 4 }}>
                <X size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.modalSearchBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Search size={18} color={theme.textMuted} />
              <TextInput
                style={[styles.modalSearchInput, { color: theme.text }]}
                placeholder="Buscar por nombre, CI o correo..."
                placeholderTextColor={theme.textMuted}
                value={modalSearchText}
                onChangeText={handleSearchModalPatients}
                autoFocus
              />
              {searchingModal && <ActivityIndicator size="small" color={theme.primary} />}
            </View>

            <ScrollView style={{ maxHeight: 340, marginTop: 12 }}>
              {modalResults.length === 0 ? (
                <Text style={{ textAlign: 'center', color: theme.textMuted, padding: 20, fontSize: 13 }}>
                  No se encontraron pacientes para ese criterio.
                </Text>
              ) : (
                modalResults.map((p) => {
                  const isAlreadyMine = assignedPatients.some((ap) => ap.id === p.id);
                  return (
                    <View key={p.id} style={[styles.modalResultItem, { borderBottomColor: theme.cardSub }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>
                          {p.fullName || p.email}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted }}>
                          {p.email} {p.cedula ? `• CI: ${p.cedula}` : ''}
                        </Text>
                      </View>
                      {isAlreadyMine ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <UserCheck size={16} color={theme.success} />
                          <Text style={{ fontSize: 12, color: theme.success, fontWeight: '700' }}>Asignado</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.modalAddBtn, { backgroundColor: theme.primary }]}
                          onPress={() => handleLinkPatient(p.id)}
                        >
                          <Text style={styles.modalAddBtnText}>Vincular</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
  },
  assignNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  assignNewBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyCardSub: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  patientCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
  },
  patientEmail: {
    fontSize: 12,
    marginTop: 1,