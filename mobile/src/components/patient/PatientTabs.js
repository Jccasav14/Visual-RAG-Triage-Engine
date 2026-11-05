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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import {
  Camera,
  Heart,
  User,
  FileText,
  ShieldCheck,
  FileCheck,
} from 'lucide-react-native';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { STATUS_BAR_HEIGHT } from '../../utils/clinicalUtils';

import { EvaluationTab } from './EvaluationTab';
import { ReportsTab } from './ReportsTab';
import { PharmacyTab } from './PharmacyTab';
import { OrdersTab } from './OrdersTab';
import { PatientProfileTab } from './PatientProfileTab';

export const PatientTabs = ({ user, token, onLogout, onUpdateUser }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('CAPTURE'); // 'CAPTURE' | 'REPORTS' | 'PHARMACY' | 'ORDERS' | 'PROFILE'
  const [selectedImages, setSelectedImages] = useState([]);
  const [symptoms, setSymptoms] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [doctorRestrictions, setDoctorRestrictions] = useState(null);

  // Daily Reports History
  const [dailyReports, setDailyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Patient Profile Form Fields
  const [fullName, setFullName] = useState(user.fullName || '');
  const [cedula, setCedula] = useState(user.cedula || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [bloodType, setBloodType] = useState(user.bloodType || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const calculateRecoveryDay = () => {
    if (doctorRestrictions && doctorRestrictions.startDate) {
      const parts = String(doctorRestrictions.startDate).split('-');
      if (parts.length === 3) {
        const startYear = parseInt(parts[0], 10);
        const startMonth = parseInt(parts[1], 10) - 1;
        const startDay = parseInt(parts[2], 10);
        const start = new Date(startYear, startMonth, startDay);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, diffDays);
      }
    }
    return 1;
  };

  const recoveryDay = calculateRecoveryDay();
  const totalDays = doctorRestrictions?.restDays || 14;
  const daysRemaining = Math.max(0, totalDays - recoveryDay);
  const progressPercent = Math.min(100, Math.round((recoveryDay / totalDays) * 100));

  useEffect(() => {
    fetchPatientRestrictions();
    loadPatientReports();
  }, [user.id]);

  const fetchPatientRestrictions = async () => {
    try {
      const restrictions = await api.getPatientRestrictions(user.id);
      if (restrictions) {
        setDoctorRestrictions(restrictions);
      }
    } catch (err) {
      console.error('Error fetching patient restrictions:', err);
    }
  };

  const loadPatientReports = async () => {
    setLoadingReports(true);
    try {
      const reports = await api.getDailyReports(user.id);
      if (Array.isArray(reports)) {
        setDailyReports(reports);
      } else {
        setDailyReports([]);
      }
    } catch (err) {
      console.warn('Notice loading daily reports:', err.message);
      setDailyReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  // Image Selection Handlers
  const pickImageGallery = async () => {
    if (selectedImages.length >= 4) {
      Alert.alert('Límite Alcanzado', 'Ya has ingresado el máximo de 4 fotos permitidas.');
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso Requerido', 'Se requiere acceso a la galería de fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 4 - selectedImages.length,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUris = result.assets.map((a) => a.uri);
      setSelectedImages((prev) => [...prev, ...newUris].slice(0, 4));
    }
  };

  const takePhotoCamera = async () => {
    if (selectedImages.length >= 4) {
      Alert.alert('Límite Alcanzado', 'Ya has ingresado el máximo de 4 fotos permitidas.');
      return;
    }
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso Requerido', 'Se requiere acceso a la cámara del dispositivo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImages((prev) => {
        if (prev.length >= 4) return prev;
        return [...prev, result.assets[0].uri];
      });
    }
  };

  const promptAddPhoto = () => {