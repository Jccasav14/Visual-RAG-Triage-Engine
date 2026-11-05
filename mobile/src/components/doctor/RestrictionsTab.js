import React, { useState, useEffect } from 'react';
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
  UserCheck,
  Calendar,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  CheckCircle,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const RestrictionsTab = ({
  token,
  selectedPatient,
  assignedPatients,
  onSelectPatient,
}) => {
  const { theme } = useTheme();
  const [openSection, setOpenSection] = useState('SURGERY'); // 'SURGERY' | 'PROHIBITIONS' | 'CARE' | 'EMERGENCY'
  const [showPatientPickerModal, setShowPatientPickerModal] = useState(false);

  // Form State
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

  useEffect(() => {
    if (selectedPatient) {
      loadPatientRestrictions(selectedPatient.id);
    }
  }, [selectedPatient?.id]);

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

  const parseStringToList = (str) => {
    if (!str) return [];
    return str
      .split(/\n|\. |\;/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);
  };

  const loadPatientRestrictions = async (patientId) => {
    setSuccessMsg('');
    try {
      const data = await api.getPatientRestrictions(patientId);
      if (data) {
        setSurgeryType(data.surgeryType || '');
        setStartDate(data.startDate || '');
        setRestDays(data.restDays ? String(data.restDays) : '14');
        setProhibitions(parseStringToList(data.prohibitions));
        setCareActions(parseStringToList(data.allowedActions));
        setEmergencyAlerts(parseStringToList(data.emergencyThresholds));
        setAllergies(data.allergies || '');
      } else {
        setSurgeryType('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setRestDays('14');
        setProhibitions([]);
        setCareActions([]);
        setEmergencyAlerts([]);
        setAllergies('');
      }
    } catch {
      // Keep empty defaults
    }
  };

  const toggleSection = (sectionKey) => {
    setOpenSection(openSection === sectionKey ? '' : sectionKey);
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

  return (
    <View style={styles.container}>
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
              {selectedPatient ? selectedPatient.fullName || selectedPatient.email : 'Toca para seleccionar un paciente'}
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
            <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('SURGERY')}>
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
            <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('PROHIBITIONS')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <View style={[styles.modIcon, { backgroundColor: theme.primaryBg }]}>
                  <Ban size={18} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modTitle, { color: theme.text }]}>2. Acciones Prohibidas</Text>
                  <Text style={[styles.modSub, { color: theme.textMuted }]}>
                    {prohibitions.length > 0 ? `${prohibitions.length} indicación(es)` : 'Sin prohibiciones registradas'}
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
                    No hay prohibiciones agregadas.
                  </Text>
                ) : (
                  <View style={{ gap: 8 }}>
                    {prohibitions.map((item, idx) => (
                      <View key={idx} style={[styles.dynamicItemRow, { backgroundColor: theme.cardSub, borderColor: theme.border }]}>
                        <Text style={[styles.dynamicItemText, { color: theme.text }]}>• {item}</Text>
                        <TouchableOpacity