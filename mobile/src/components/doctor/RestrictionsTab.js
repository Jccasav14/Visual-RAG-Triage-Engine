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