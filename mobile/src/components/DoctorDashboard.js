import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import {
  Stethoscope,
  User,
  Search,
  Save,
  LogOut,
  CheckCircle,
  CheckCircle2,
  UserPlus,
  UserCheck,
  Calendar,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  FileText,
  Users,
  Activity,
  Trash2,
  X,
  CreditCard,
  ShieldCheck,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Building,
  Award,
  Phone,
  Cpu,
  Layers,
  Sparkles,
  Check,
  Clock,
  ShieldAlert,
  Heart,
  Droplet,
  Ban,
} from 'lucide-react-native';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

const CLINICAL_CATEGORIES = [
  { id: '1', name: 'Cicatrización Normal', type: 'Eutrófica', severity: 'LOW' },
  { id: '2', name: 'Tejido Granulación', type: 'Fisiológico', severity: 'LOW' },
  { id: '3', name: 'Secreción Serosa', type: 'Fisiológico', severity: 'LOW' },
  { id: '4', name: 'Eritema Leve', type: 'Perilesional', severity: 'MEDIUM' },
  { id: '5', name: 'Edema Inflamatorio', type: 'Moderado', severity: 'MEDIUM' },
  { id: '6', name: 'Hematoma', type: 'Subcutáneo', severity: 'MEDIUM' },
  { id: '7', name: 'Dehiscencia', type: 'Superficial', severity: 'HIGH' },
  { id: '8', name: 'Exudado Purulento', type: 'Infeccioso', severity: 'CRITICAL' },
  { id: '9', name: 'Infección ISQ', type: 'Bacteriana', severity: 'CRITICAL' },
  { id: '10', name: 'Necrosis Tisular', type: 'Isquemia', severity: 'CRITICAL' },
];

export const DoctorDashboard = ({ user, token, onLogout, onUpdateUser }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('PATIENTS'); // 'PATIENTS' | 'RESTRICTIONS' | 'VISION' | 'PROFILE'
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Accordion active section: 'SURGERY' | 'PROHIBITIONS' | 'CARE' | 'EMERGENCY'
  const [openSection, setOpenSection] = useState('SURGERY');

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPatientPickerModal, setShowPatientPickerModal] = useState(false);
  const [modalSearchText, setModalSearchText] = useState('');
  const [modalResults, setModalResults] = useState([]);
  const [searchingModal, setSearchingModal] = useState(false);

  // Dynamic Ficha State
  const [surgeryType, setSurgeryType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [restDays, setRestDays] = useState('14');
  const [endDate, setEndDate] = useState('');
  const [prohibitions, setProhibitions] = useState([]);
  const [newProhibition, setNewProhibition] = useState('');
  const [careActions, setCareActions] = useState([]);
  const [newCareAction, setNewCareAction] = useState('');
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [newEmergencyAlert, setNewEmergencyAlert] = useState('');
  const [allergies, setAllergies] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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

  useEffect(() => {
    if (startDate && restDays) {
      const days = parseInt(restDays, 10);
      if (!isNaN(days) && days > 0) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          const end = new Date(start);
          end.setDate(start.getDate() + days);
          setEndDate(end.toISOString().split('T')[0]);
          return;
        }
      }
    }
    setEndDate('');
  }, [startDate, restDays]);

  const loadAssignedPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await api.getDoctorPatients(user.id);
      setAssignedPatients(data || []);
      if (data && data.length > 0 && !selectedPatient) {
        selectPatientForEdit(data[0]);
      }
    } catch (err) {
      console.error('Error fetching doctor patients:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const parseStringToList = (str) => {
    if (!str) return [];
    return str
      .split(/\n|\. |\;/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);
  };

  const selectPatientForEdit = async (patient) => {
    setSelectedPatient(patient);
    setSuccessMsg('');
    setOpenSection('SURGERY');

    try {
      const restrictions = await api.getPatientRestrictions(patient.id);
      if (restrictions) {
        setSurgeryType(restrictions.surgeryType || '');
        setStartDate(restrictions.startDate || '');
        setRestDays(restrictions.restDays ? String(restrictions.restDays) : '14');
        setProhibitions(parseStringToList(restrictions.prohibitions));
        setCareActions(parseStringToList(restrictions.allowedActions));
        setEmergencyAlerts(parseStringToList(restrictions.emergencyThresholds));
        setAllergies(restrictions.allergies || '');
      } else {
        setSurgeryType('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setRestDays('14');
        setProhibitions([]);
        setCareActions([]);
        setEmergencyAlerts([]);
        setAllergies('');
      }
    } catch (err) {
      console.error('Error fetching patient restrictions:', err);
    }
  };

  const handleOpenAssignModal = () => {
    setShowAssignModal(true);
    setModalSearchText('');
    setModalResults([]);
    api.getAllPatients().then((res) => {
      if (res) setModalResults(res);
    }).catch(() => {});
  };

  const handleSearchModalPatients = async (query) => {
    setModalSearchText(query);
    if (!query.trim()) {
      api.getAllPatients().then((res) => setModalResults(res || [])).catch(() => {});
      return;
    }
    setSearchingModal(true);
    try {
      const results = await api.searchPatients(query.trim());
      setModalResults(results || []);
    } catch (err) {
      console.error('Error searching modal patients:', err);
    } finally {
      setSearchingModal(false);
    }
  };

  const handleAssignPatient = async (patient) => {
    try {
      await api.assignPatientToDoctor(patient.id, user.id);
      Alert.alert('Asignación Exitosa', `${patient.fullName || patient.email} asignado a tu cuidado.`);
      setShowAssignModal(false);
      await loadAssignedPatients();
      selectPatientForEdit(patient);
      setActiveTab('RESTRICTIONS');
    } catch {
      Alert.alert('Error', 'No se pudo asignar el paciente.');
    }
  };

  const handleUnassignPatient = async (patient) => {
    Alert.alert(
      'Desvincular Paciente',
      `¿Deseas retirar a ${patient.fullName || patient.email} de tus pacientes activos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.unassignPatient(patient.id);
              const remaining = assignedPatients.filter((p) => p.id !== patient.id);
              setAssignedPatients(remaining);
              if (selectedPatient?.id === patient.id) {
                if (remaining.length > 0) {
                  selectPatientForEdit(remaining[0]);
                } else {
                  setSelectedPatient(null);
                }
              }
              Alert.alert('Desvinculado', 'Paciente retirado de tu lista.');
            } catch {
              Alert.alert('Error', 'No se pudo desvincular al paciente.');
            }
          },
        },
      ]
    );
  };

  const handleAddItem = (value, setValue, list, setList) => {
    if (!value.trim()) return;
    if (!list.includes(value.trim())) {
      setList([...list, value.trim()]);
    }
    setValue('');
  };

  const handleRemoveItem = (indexToRemove, list, setList) => {
    setList(list.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveRestrictions = async () => {
    if (!selectedPatient) {
      Alert.alert('Selección Requerida', 'Debes seleccionar a un paciente.');
      return;
    }
    if (!surgeryType.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el procedimiento quirúrgico en la sección 1.');
      setOpenSection('SURGERY');
      return;
    }

    setSaving(true);
    setSuccessMsg('');

    const daysNum = parseInt(restDays, 10) || 14;
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + daysNum);
    const isoEnd = end.toISOString().split('T')[0];

    try {
      await api.saveMedicalRestrictions(token, {
        patientId: selectedPatient.id,
        surgeryType: surgeryType.trim(),
        startDate: startDate.trim() || new Date().toISOString().split('T')[0],
        endDate: isoEnd,
        restDays: daysNum,
        followupAppointmentDate: isoEnd,
        status: 'ACTIVE',
        prohibitions: prohibitions.join('. '),
        allowedActions: careActions.join('. '),
        allergies: allergies.trim(),
        emergencyThresholds: emergencyAlerts.join('. '),
        notes: '',
      });
      setSuccessMsg(`Ficha de ${selectedPatient.fullName || selectedPatient.email} guardada.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving restrictions:', err);
      Alert.alert('Error', 'No se pudo guardar la ficha clínica.');
    } finally {
      setSaving(false);
    }
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

  const filteredPatients = assignedPatients.filter((p) => {
    const q = searchFilter.toLowerCase();
    return (
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.cedula || '').toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBg} translucent={false} />

      {/* TOP HEADER */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={[styles.headerIconContainer, { backgroundColor: theme.primaryBg }]}>
            <Stethoscope size={22} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.headerSubtitle, { color: theme.primary }]}>CIRUJANO TRATANTE</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{user.fullName || user.email}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: theme.primaryBg }]}>
          <Text style={[styles.statusBadgeText, { color: theme.primary }]}>En Servicio</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TAB 1: MIS PACIENTES */}
        {activeTab === 'PATIENTS' && (
          <View>
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

            {/* SEARCH */}
            <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.inputBorder }]}>
              <Search size={18} color={theme.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Buscar por nombre, cédula o correo..."
                placeholderTextColor={theme.textMuted}
                value={searchFilter}
                onChangeText={setSearchFilter}
              />
              <TouchableOpacity onPress={loadAssignedPatients} style={{ padding: 6 }}>
                <RefreshCw size={16} color={theme.primary} />
              </TouchableOpacity>
            </View>

            {loadingPatients ? (
              <ActivityIndicator color={theme.primary} style={{ marginTop: 24 }} />
            ) : filteredPatients.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Users size={40} color={theme.textMuted} />
                <Text style={[styles.emptyCardTitle, { color: theme.text }]}>Sin pacientes asignados</Text>
                <Text style={[styles.emptyCardSub, { color: theme.textMuted }]}>
                  Toca "+ Asignar" para buscar usuarios registrados y agregarlos.
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
                          <Text style={[styles.patientName, { color: theme.text }]}>{patient.fullName || patient.email}</Text>
                          <Text style={[styles.patientEmail, { color: theme.textMuted }]}>{patient.email}</Text>
                          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                            {!!patient.cedula && (
                              <Text style={[styles.patientCedula, { color: theme.primary }]}>CI: {patient.cedula}</Text>
                            )}
                            {!!patient.bloodType && (
                              <Text style={[styles.patientBadge, { color: theme.textMuted }]}>Grupo: {patient.bloodType}</Text>
                            )}
                          </View>
                        </View>
                      </View>

                      <View style={[styles.patientActionsRow, { borderTopColor: theme.cardSub }]}>
                        <TouchableOpacity
                          style={[styles.editFichaBtn, { backgroundColor: theme.primary }]}
                          onPress={() => {
                            selectPatientForEdit(patient);
                            setActiveTab('RESTRICTIONS');
                          }}
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
          </View>
        )}

        {/* TAB 2: FICHA POSTOPERATORIA (SOLO TÍTULO LIMPIO) */}
        {activeTab === 'RESTRICTIONS' && (
          <View>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Ficha Postoperatoria</Text>

            {/* SELECTOR DE PACIENTE */}
            <TouchableOpacity
              style={[styles.patientDropdownCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setShowPatientPickerModal(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={[styles.pickerIconCircle, { backgroundColor: theme.primaryBg }]}>
                  <UserCheck size={18} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>PACIENTE SELECCIONADO</Text>
                  <Text style={[styles.pickerValue, { color: theme.text }]} numberOfLines={1}>
                    {selectedPatient ? (selectedPatient.fullName || selectedPatient.email) : 'Toca para seleccionar un paciente'}
                  </Text>
                </View>
              </View>
              <View style={[styles.changePill, { backgroundColor: theme.cardSub }]}>
                <Text style={[styles.changePillText, { color: theme.primary }]}>Cambiar</Text>
                <ChevronDown size={14} color={theme.primary} />
              </View>
            </TouchableOpacity>

            {selectedPatient ? (
              <View style={{ marginTop: 14, gap: 10 }}>
                {/* 1. CIRUGÍA Y CRONOGRAMA */}
                <View style={[styles.accordionModule, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setOpenSection(openSection === 'SURGERY' ? '' : 'SURGERY')}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.modIcon, { backgroundColor: theme.primaryBg }]}>
                        <Calendar size={18} color={theme.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modTitle, { color: theme.text }]}>1. Cirugía & Cronograma</Text>
                        <Text style={[styles.modSub, { color: theme.textMuted }]}>
                          {surgeryType ? `${surgeryType} • ${restDays} días` : 'Ingresar datos de cirugía'}
                        </Text>
                      </View>
                    </View>
                    {openSection === 'SURGERY' ? (
                      <ChevronUp size={20} color={theme.textMuted} />
                    ) : (
                      <ChevronDown size={20} color={theme.textMuted} />
                    )}
                  </TouchableOpacity>

                  {openSection === 'SURGERY' && (
                    <View style={[styles.accordionBody, { borderTopColor: theme.cardSub }]}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>Procedimiento Quirúrgico:</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                        placeholder="Ej. Apendicectomía Laparoscópica"
                        placeholderTextColor={theme.textMuted}
                        value={surgeryType}
                        onChangeText={setSurgeryType}
                      />

                      <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.inputLabel, { color: theme.text }]}>Fecha Cirugía:</Text>
                          <TextInput
                            style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                            placeholder="AAAA-MM-DD"
                            placeholderTextColor={theme.textMuted}
                            value={startDate}
                            onChangeText={setStartDate}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.inputLabel, { color: theme.text }]}>Días Reposo:</Text>
                          <TextInput
                            style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                            placeholder="14"
                            placeholderTextColor={theme.textMuted}
                            value={restDays}
                            onChangeText={setRestDays}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>

                      {!!endDate && (
                        <View style={[styles.dateAlertBox, { backgroundColor: theme.primaryBg }]}>
                          <Text style={[styles.dateAlertText, { color: theme.primary }]}>
                            Alta estimada: <Text style={{ fontWeight: '800' }}>{endDate}</Text>
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                {/* 2. ACCIONES PROHIBIDAS */}
                <View style={[styles.accordionModule, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setOpenSection(openSection === 'PROHIBITIONS' ? '' : 'PROHIBITIONS')}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.modIcon, { backgroundColor: theme.primaryBg }]}>
                        <Ban size={18} color={theme.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modTitle, { color: theme.text }]}>2. Acciones Prohibidas</Text>
                        <Text style={[styles.modSub, { color: theme.textMuted }]}>
                          {prohibitions.length > 0 ? `${prohibitions.length} indicación(es) registrada(s)` : 'Sin prohibiciones registradas'}
                        </Text>
                      </View>
                    </View>
                    {openSection === 'PROHIBITIONS' ? (
                      <ChevronUp size={20} color={theme.textMuted} />
                    ) : (
                      <ChevronDown size={20} color={theme.textMuted} />
                    )}
                  </TouchableOpacity>

                  {openSection === 'PROHIBITIONS' && (
                    <View style={[styles.accordionBody, { borderTopColor: theme.cardSub }]}>
                      {prohibitions.length === 0 ? (
                        <Text style={[styles.emptyListText, { color: theme.textMuted }]}>
                          No hay prohibiciones agregadas. Escribe abajo para añadir una.
                        </Text>
                      ) : (
                        <View style={{ gap: 8 }}>
                          {prohibitions.map((item, idx) => (
                            <View key={idx} style={[styles.dynamicItemRow, { backgroundColor: theme.cardSub, borderColor: theme.border }]}>
                              <Text style={[styles.dynamicItemText, { color: theme.text }]}>{item}</Text>
                              <TouchableOpacity
                                onPress={() => handleRemoveItem(idx, prohibitions, setProhibitions)}
                                style={styles.itemDeleteBtn}
                              >
                                <Trash2 size={16} color={theme.danger} />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* ADD INPUT */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                        <TextInput
                          style={[styles.customInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                          placeholder="Escribir nueva prohibición..."
                          placeholderTextColor={theme.textMuted}
                          value={newProhibition}
                          onChangeText={setNewProhibition}
                          onSubmitEditing={() => handleAddItem(newProhibition, setNewProhibition, prohibitions, setProhibitions)}
                        />
                        <TouchableOpacity
                          style={[styles.addCustomBtn, { backgroundColor: theme.primary }]}
                          onPress={() => handleAddItem(newProhibition, setNewProhibition, prohibitions, setProhibitions)}
                        >
                          <Plus size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* 3. CUIDADOS Y CURACIONES */}
                <View style={[styles.accordionModule, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setOpenSection(openSection === 'CARE' ? '' : 'CARE')}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.modIcon, { backgroundColor: theme.primaryBg }]}>
                        <CheckCircle2 size={18} color={theme.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modTitle, { color: theme.text }]}>3. Cuidados & Curaciones</Text>
                        <Text style={[styles.modSub, { color: theme.textMuted }]}>
                          {careActions.length > 0 ? `${careActions.length} indicación(es) registrada(s)` : 'Sin cuidados registrados'}
                        </Text>
                      </View>
                    </View>
                    {openSection === 'CARE' ? (
                      <ChevronUp size={20} color={theme.textMuted} />
                    ) : (
                      <ChevronDown size={20} color={theme.textMuted} />
                    )}
                  </TouchableOpacity>

                  {openSection === 'CARE' && (
                    <View style={[styles.accordionBody, { borderTopColor: theme.cardSub }]}>
                      {careActions.length === 0 ? (
                        <Text style={[styles.emptyListText, { color: theme.textMuted }]}>
                          No hay cuidados agregados. Escribe abajo para añadir uno.
                        </Text>
                      ) : (
                        <View style={{ gap: 8 }}>
                          {careActions.map((item, idx) => (
                            <View key={idx} style={[styles.dynamicItemRow, { backgroundColor: theme.cardSub, borderColor: theme.border }]}>
                              <Text style={[styles.dynamicItemText, { color: theme.text }]}>{item}</Text>
                              <TouchableOpacity
                                onPress={() => handleRemoveItem(idx, careActions, setCareActions)}
                                style={styles.itemDeleteBtn}
                              >
                                <Trash2 size={16} color={theme.danger} />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* ADD INPUT */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                        <TextInput
                          style={[styles.customInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                          placeholder="Escribir nuevo cuidado médico..."
                          placeholderTextColor={theme.textMuted}
                          value={newCareAction}
                          onChangeText={setNewCareAction}
                          onSubmitEditing={() => handleAddItem(newCareAction, setNewCareAction, careActions, setCareActions)}
                        />
                        <TouchableOpacity
                          style={[styles.addCustomBtn, { backgroundColor: theme.primary }]}
                          onPress={() => handleAddItem(newCareAction, setNewCareAction, careActions, setCareActions)}
                        >
                          <Plus size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* 4. SEÑALES DE ALERTA Y ALERGIAS */}
                <View style={[styles.accordionModule, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => setOpenSection(openSection === 'EMERGENCY' ? '' : 'EMERGENCY')}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.modIcon, { backgroundColor: theme.primaryBg }]}>
                        <AlertTriangle size={18} color={theme.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.modTitle, { color: theme.text }]}>4. Alergias & Urgencias</Text>
                        <Text style={[styles.modSub, { color: theme.textMuted }]}>
                          {emergencyAlerts.length > 0 || allergies ? `${emergencyAlerts.length} alerta(s) de urgencia` : 'Configurar signos de alerta'}
                        </Text>
                      </View>
                    </View>
                    {openSection === 'EMERGENCY' ? (
                      <ChevronUp size={20} color={theme.textMuted} />
                    ) : (
                      <ChevronDown size={20} color={theme.textMuted} />
                    )}
                  </TouchableOpacity>

                  {openSection === 'EMERGENCY' && (
                    <View style={[styles.accordionBody, { borderTopColor: theme.cardSub }]}>
                      <Text style={[styles.inputLabel, { color: theme.text }]}>Señales de Alarma para Urgencias:</Text>
                      {emergencyAlerts.length === 0 ? (
                        <Text style={[styles.emptyListText, { color: theme.textMuted, marginVertical: 6 }]}>
                          No hay señales de alarma registradas.
                        </Text>
                      ) : (
                        <View style={{ gap: 8, marginTop: 4 }}>
                          {emergencyAlerts.map((item, idx) => (
                            <View key={idx} style={[styles.dynamicItemRow, { backgroundColor: theme.cardSub, borderColor: theme.border }]}>
                              <Text style={[styles.dynamicItemText, { color: theme.text }]}>{item}</Text>
                              <TouchableOpacity
                                onPress={() => handleRemoveItem(idx, emergencyAlerts, setEmergencyAlerts)}
                                style={styles.itemDeleteBtn}
                              >
                                <Trash2 size={16} color={theme.danger} />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* ADD EMERGENCY INPUT */}
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                        <TextInput
                          style={[styles.customInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                          placeholder="Escribir señal de alarma..."
                          placeholderTextColor={theme.textMuted}
                          value={newEmergencyAlert}
                          onChangeText={setNewEmergencyAlert}
                          onSubmitEditing={() => handleAddItem(newEmergencyAlert, setNewEmergencyAlert, emergencyAlerts, setEmergencyAlerts)}
                        />
                        <TouchableOpacity
                          style={[styles.addCustomBtn, { backgroundColor: theme.primary }]}
                          onPress={() => handleAddItem(newEmergencyAlert, setNewEmergencyAlert, emergencyAlerts, setEmergencyAlerts)}
                        >
                          <Plus size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>

                      <Text style={[styles.inputLabel, { color: theme.text, marginTop: 14 }]}>Alergias del Paciente:</Text>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                        placeholder="Ej. Penicilina, Látex, Ninguna..."
                        placeholderTextColor={theme.textMuted}
                        value={allergies}
                        onChangeText={setAllergies}
                      />
                    </View>
                  )}
                </View>

                {/* BOTÓN GUARDAR ELEGANTE */}
                <TouchableOpacity
                  style={[styles.saveFichaActionBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSaveRestrictions}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Save size={18} color="#FFFFFF" />
                      <Text style={styles.saveFichaActionBtnText}>Guardar Ficha Postoperatoria</Text>
                    </View>
                  )}
                </TouchableOpacity>

                {!!successMsg && (
                  <View style={[styles.successBox, { backgroundColor: theme.successBg, borderColor: theme.success }]}>
                    <CheckCircle size={18} color={theme.success} />
                    <Text style={[styles.successText, { color: theme.successText }]}>{successMsg}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 14 }]}>
                <Text style={[styles.emptyCardTitle, { color: theme.text }]}>Ningún paciente seleccionado</Text>
                <Text style={[styles.emptyCardSub, { color: theme.textMuted }]}>
                  Toca el botón superior para elegir al paciente.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: ANÁLISIS VISUAL (SOLO TÍTULO LIMPIO) */}
        {activeTab === 'VISION' && (
          <View>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Consola de Análisis Visual</Text>

            {/* TELEMETRY ENGINE CARD */}
            <View style={[styles.consoleCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.consoleHeaderRow}>
                <View style={[styles.engineIconBox, { backgroundColor: theme.primaryBg }]}>
                  <Cpu size={22} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.engineTitle, { color: theme.text }]}>Motor de Inferencia Visual</Text>
                  <Text style={[styles.engineSub, { color: theme.textMuted }]}>TensorFlow 2.15 • FastAPI Backend</Text>
                </View>
                <View style={[styles.onlineBadge, { backgroundColor: theme.successBg }]}>
                  <Text style={[styles.onlineBadgeText, { color: theme.successText }]}>Activo</Text>
                </View>
              </View>

              <View style={styles.metricsGrid}>
                <View style={[styles.metricTile, { backgroundColor: theme.cardSub }]}>
                  <Text style={[styles.metricTileLabel, { color: theme.textMuted }]}>PRECISIÓN</Text>
                  <Text style={[styles.metricTileVal, { color: theme.primary }]}>97.4%</Text>
                </View>
                <View style={[styles.metricTile, { backgroundColor: theme.cardSub }]}>
                  <Text style={[styles.metricTileLabel, { color: theme.textMuted }]}>PÉRDIDA</Text>
                  <Text style={[styles.metricTileVal, { color: theme.text }]}>0.082</Text>
                </View>
                <View style={[styles.metricTile, { backgroundColor: theme.cardSub }]}>
                  <Text style={[styles.metricTileLabel, { color: theme.textMuted }]}>LATENCIA</Text>
                  <Text style={[styles.metricTileVal, { color: theme.text }]}>~42 ms</Text>
                </View>
                <View style={[styles.metricTile, { backgroundColor: theme.cardSub }]}>
                  <Text style={[styles.metricTileLabel, { color: theme.textMuted }]}>MUESTRAS</Text>
                  <Text style={[styles.metricTileVal, { color: theme.text }]}>2,940</Text>
                </View>
              </View>
            </View>

            {/* CATEGORÍAS EN GRID VISUAL LIMPIO */}
            <Text style={[styles.subHeading, { color: theme.text, marginTop: 18, marginBottom: 10 }]}>
              Categorías Quirúrgicas Monitoreadas:
            </Text>

            <View style={styles.categoriesGrid}>
              {CLINICAL_CATEGORIES.map((cls) => {
                const dotColor =
                  cls.severity === 'LOW' ? theme.success : cls.severity === 'MEDIUM' ? theme.warning : theme.danger;
                return (
                  <View
                    key={cls.id}
                    style={[styles.categoryTile, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[styles.severityDot, { backgroundColor: dotColor }]} />
                      <Text style={[styles.categoryTileName, { color: theme.text }]} numberOfLines={1}>
                        {cls.name}
                      </Text>
                    </View>
                    <Text style={[styles.categoryTileSub, { color: theme.textMuted }]}>{cls.type}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 4: PERFIL Y CONFIGURACIÓN (SOLO TÍTULO LIMPIO) */}
        {activeTab === 'PROFILE' && (
          <View>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Perfil y Configuración</Text>

            {/* DOCTOR HERO CARD */}
            <View style={[styles.profileHeroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.profileAvatarCircle, { backgroundColor: theme.primaryBg }]}>
                <Stethoscope size={34} color={theme.primary} />
              </View>
              <Text style={[styles.profileHeroName, { color: theme.text }]}>{user.fullName || user.email}</Text>
              <Text style={[styles.profileHeroEmail, { color: theme.textMuted }]}>{user.email}</Text>
              <View style={[styles.roleBadge, { backgroundColor: theme.primaryBg }]}>
                <Text style={[styles.roleBadgeText, { color: theme.primary }]}>CIRUJANO TRATANTE CERTIFICADO</Text>
              </View>

              {/* STATS ROW */}
              <View style={[styles.profileStatsRow, { borderTopColor: theme.cardSub }]}>
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNum, { color: theme.primary }]}>{assignedPatients.length}</Text>
                  <Text style={[styles.profileStatLbl, { color: theme.textMuted }]}>Pacientes</Text>
                </View>
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNum, { color: theme.primary }]}>98.5%</Text>
                  <Text style={[styles.profileStatLbl, { color: theme.textMuted }]}>Efectividad</Text>
                </View>
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNum, { color: theme.primary }]}>10</Text>
                  <Text style={[styles.profileStatLbl, { color: theme.textMuted }]}>Patologías</Text>
                </View>
              </View>
            </View>

            {/* CONFIGURACIÓN DE TEMA / MODO OSCURO */}
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

            {/* EDIT CLINICAL CREDENTIALS */}
            <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 14 }]}>
              <Text style={[styles.subHeading, { color: theme.text, marginBottom: 10 }]}>Datos Profesionales:</Text>

              <Text style={[styles.inputLabel, { color: theme.text }]}>Nombre Completo:</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                value={fullName}
                onChangeText={setFullName}
              />

              <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Especialidad Quirúrgica:</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                value={specialty}
                onChangeText={setSpecialty}
              />

              <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Registro Médico MSP:</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />

              <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Hospital o Clínica:</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                value={hospital}
                onChangeText={setHospital}
              />

              <Text style={[styles.inputLabel, { color: theme.text, marginTop: 10 }]}>Teléfono de Contacto:</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={[styles.saveProfileBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Save size={16} color="#FFFFFF" />
                    <Text style={styles.saveProfileBtnText}>Guardar Datos Profesionales</Text>
                  </View>
                )}
              </TouchableOpacity>

              {!!profileMsg && (
                <Text style={{ color: theme.success, marginTop: 8, fontWeight: '700', fontSize: 13 }}>
                  {profileMsg}
                </Text>
              )}
            </View>

            {/* LOGOUT */}
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
        )}
      </ScrollView>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <View style={[styles.bottomBar, { backgroundColor: theme.bottomBar, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('PATIENTS')}>
          <Users size={22} color={activeTab === 'PATIENTS' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'PATIENTS' ? theme.primary : theme.textMuted }]}>
            Pacientes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('RESTRICTIONS')}>
          <FileText size={22} color={activeTab === 'RESTRICTIONS' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'RESTRICTIONS' ? theme.primary : theme.textMuted }]}>
            Ficha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('VISION')}>
          <Activity size={22} color={activeTab === 'VISION' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'VISION' ? theme.primary : theme.textMuted }]}>
            Análisis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBtn} onPress={() => setActiveTab('PROFILE')}>
          <User size={22} color={activeTab === 'PROFILE' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'PROFILE' ? theme.primary : theme.textMuted }]}>
            Perfil
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL SELECCIONADOR DE PACIENTE */}
      <Modal visible={showPatientPickerModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar Paciente</Text>
              <TouchableOpacity onPress={() => setShowPatientPickerModal(false)} style={{ padding: 4 }}>
                <X size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 340, marginTop: 8 }}>
              {assignedPatients.map((p) => {
                const isCurrent = selectedPatient?.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.modalPatientPickItem,
                      { borderBottomColor: theme.cardSub, backgroundColor: isCurrent ? theme.primaryBg : 'transparent' },
                    ]}
                    onPress={() => {
                      selectPatientForEdit(p);
                      setShowPatientPickerModal(false);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: theme.text }}>
                        {p.fullName || p.email}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>
                        {p.email} {p.cedula ? `• CI: ${p.cedula}` : ''}
                      </Text>
                    </View>
                    {isCurrent && <Check size={20} color={theme.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                        <Text style={{ fontSize: 12, color: theme.primary, fontWeight: '700' }}>Asignado</Text>
                      ) : (
                        <TouchableOpacity
                          style={[styles.modalAssignBtn, { backgroundColor: theme.primary }]}
                          onPress={() => handleAssignPatient(p)}
                        >
                          <Text style={styles.modalAssignBtnText}>Asignar</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '800' },

  scrollContent: { padding: 18, paddingBottom: 90 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeading: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
  subHeading: { fontSize: 16, fontWeight: '800' },

  assignNewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assignNewBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  searchBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    marginTop: 4,
  },
  searchInput: { flex: 1, paddingVertical: 8, paddingHorizontal: 8, fontSize: 14 },

  emptyCard: {
    padding: 28,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyCardTitle: { fontSize: 15, fontWeight: '700', marginTop: 8 },
  emptyCardSub: { fontSize: 13, textAlign: 'center', marginTop: 4 },

  patientCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: { fontSize: 16, fontWeight: '700' },
  patientEmail: { fontSize: 13, marginTop: 2 },
  patientCedula: { fontSize: 12, fontWeight: '700' },
  patientBadge: { fontSize: 12, fontWeight: '600' },

  patientActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  editFichaBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editFichaBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  unassignBtn: { padding: 10, borderRadius: 10 },

  // PATIENT DROPDOWN CARD
  patientDropdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  pickerIconCircle: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pickerLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  pickerValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changePillText: { fontSize: 12, fontWeight: '700' },

  // ACCORDION MODULES
  accordionModule: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  modIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modTitle: { fontSize: 15, fontWeight: '800' },
  modSub: { fontSize: 12, marginTop: 2 },
  accordionBody: {
    padding: 14,
    borderTopWidth: 1,
  },

  emptyListText: { fontSize: 13, fontStyle: 'italic', paddingVertical: 4 },

  // DYNAMIC ITEM ROW
  dynamicItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dynamicItemText: { fontSize: 13, flex: 1, fontWeight: '600', lineHeight: 18 },
  itemDeleteBtn: { padding: 4, marginLeft: 8 },

  inputLabel: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
  },
  dateAlertBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  dateAlertText: { fontSize: 13 },

  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  addCustomBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveFichaActionBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveFichaActionBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  formCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },

  successBox: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    borderWidth: 1,
  },
  successText: { fontWeight: '700', fontSize: 13, flex: 1 },

  // VISION CONSOLE
  consoleCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  consoleHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  engineIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  engineTitle: { fontSize: 16, fontWeight: '800' },
  engineSub: { fontSize: 12, marginTop: 2 },
  onlineBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  onlineBadgeText: { fontSize: 12, fontWeight: '800' },

  metricsGrid: { flexDirection: 'row', gap: 8, marginTop: 14 },
  metricTile: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  metricTileLabel: { fontSize: 9, fontWeight: '800' },
  metricTileVal: { fontSize: 14, fontWeight: '800', marginTop: 2 },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryTile: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  categoryTileName: { fontSize: 13, fontWeight: '700', flex: 1 },
  categoryTileSub: { fontSize: 11, marginTop: 3 },

  // PROFILE STYLES
  profileHeroCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  profileAvatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileHeroName: { fontSize: 20, fontWeight: '800' },
  profileHeroEmail: { fontSize: 13, marginTop: 2 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, marginTop: 8 },
  roleBadgeText: { fontSize: 11, fontWeight: '800' },
  profileStatsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  profileStatItem: { flex: 1, alignItems: 'center' },
  profileStatNum: { fontSize: 18, fontWeight: '900' },
  profileStatLbl: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  themeCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeCardTitle: { fontSize: 14, fontWeight: '800' },
  themeCardSub: { fontSize: 12, marginTop: 1 },
  themeSwitchPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  themeSwitchPillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  saveProfileBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  saveProfileBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  logoutBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabBtnLabel: { fontSize: 11, fontWeight: '700', marginTop: 3 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 20 },
  modalContainer: { borderRadius: 18, padding: 18, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 17, fontWeight: '800' },

  modalPatientPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderBottomWidth: 1,
  },

  modalSearchBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  modalSearchInput: { flex: 1, paddingVertical: 8, paddingHorizontal: 6, fontSize: 14 },
  modalResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalAssignBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalAssignBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
