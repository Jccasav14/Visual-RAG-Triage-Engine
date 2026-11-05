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
    if (selectedImages.length >= 4) {
      Alert.alert('Límite de Fotos', 'Has completado las 4 fotos máximas.');
      return;
    }
    Alert.alert('Agregar Foto de Incisión', 'Elige cómo deseas capturar la imagen:', [
      { text: 'Tomar con Cámara', onPress: takePhotoCamera },
      { text: 'Elegir de Galería', onPress: pickImageGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Evaluation Submission Handler
  const handleEvaluate = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('Fotografía Requerida', 'Por favor toma o selecciona al menos 1 foto de tu incisión.');
      return;
    }
    setEvaluating(true);

    try {
      const visionPromises = selectedImages.map((uri) => api.classifyWoundFile(uri, recoveryDay));
      const visionResults = await Promise.all(visionPromises);

      let bestClassification = {
        class_name: 'Cicatrización Normal',
        severity: 'LOW',
        confidence_percentage: 97.4,
      };

      let highestConfidence = 0;
      visionResults.forEach((res) => {
        const c = res.classification;
        if (c) {
          if (c.severity === 'HIGH' || (c.confidence_percentage || 0) > highestConfidence) {
            bestClassification = c;
            highestConfidence = c.confidence_percentage || 0;
          }
        }
      });

      const base64Photos = await Promise.all(
        selectedImages.map(async (uri) => {
          try {
            if (uri.startsWith('data:image')) return uri;
            const b64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${b64}`;
          } catch {
            return uri;
          }
        })
      );

      const fullSymptoms = symptoms.trim() || 'Sin molestias particulares referidas.';
      const multiPhotoNote = `Evaluación integral con ${selectedImages.length} perspectiva(s) fotográfica(s). Diagnóstico: ${bestClassification.class_name}.`;

      const llmResult = await api.generatePersonalizedPlan(token, {
        patientId: user.id,
        classificationResult: bestClassification.class_name,
        severity: bestClassification.severity,
        symptoms: fullSymptoms,
        recoveryDay: recoveryDay,
        medicalRestrictions: doctorRestrictions ? JSON.stringify(doctorRestrictions) : '',
        dayAssessmentNote: multiPhotoNote,
      });

      const planText = llmResult.doctorVirtualPlan || llmResult.plan || 'Evaluación completada exitosamente.';

      const newReport = {
        id: `REP-${Date.now().toString().slice(-6)}`,
        patientId: user.id,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        recoveryDay: recoveryDay,
        imageUris: base64Photos,
        symptoms: fullSymptoms,
        classification: bestClassification.class_name,
        severity: bestClassification.severity,
        confidence: bestClassification.confidence_percentage || 97.4,
        plan: planText.replace(/\*\*/g, ''),
        surgeryType: doctorRestrictions?.surgeryType || 'Cirugía General',
      };

      try {
        await api.saveDailyReport(token, newReport);
      } catch (dbErr) {
        console.warn('DB Report save notice:', dbErr.message);
      }

      setDailyReports((prev) => [newReport, ...prev]);
      setSelectedImages([]);
      setSymptoms('');
      setActiveTab('REPORTS');
    } catch (err) {
      console.error('Evaluation error:', err);
      Alert.alert(
        'Error de Evaluación',
        'No se pudo conectar con el servicio clínico. Verifica que los servicios estén activos.'
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const updated = await api.updateProfile(user.id, {
        fullName: fullName.trim(),
        cedula: cedula.trim(),
        phone: phone.trim(),
        bloodType: bloodType.trim(),
        emergencyContact: emergencyContact.trim(),
        birthDate: birthDate.trim(),
      });
      if (onUpdateUser) onUpdateUser(updated);
      setProfileMsg('Perfil actualizado exitosamente.');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBg} translucent={false} />

      {/* TOP HEADER */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconContainer, { backgroundColor: theme.primaryBg }]}>
            <Heart size={20} color={theme.primary} />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.headerSubtitle, { color: theme.primary }]}>PORTAL PACIENTE</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
              {user.fullName || user.email}
            </Text>
          </View>
        </View>

        <View style={[styles.dayBadge, { backgroundColor: theme.primaryBg, borderColor: theme.border }]}>
          <Text style={[styles.dayBadgeText, { color: theme.primary }]}>Día {recoveryDay}</Text>
        </View>
      </View>

      {/* CONTENT TABS */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'CAPTURE' && (
            <EvaluationTab
              doctorRestrictions={doctorRestrictions}
              recoveryDay={recoveryDay}
              totalDays={totalDays}
              progressPercent={progressPercent}
              selectedImages={selectedImages}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              evaluating={evaluating}
              onTakePhoto={takePhotoCamera}
              onPickGallery={pickImageGallery}
              onPromptAddPhoto={promptAddPhoto}
              onRemoveImage={removeImage}
              onSubmitEvaluation={handleEvaluate}
            />
          )}

          {activeTab === 'REPORTS' && (
            <ReportsTab
              user={user}
              dailyReports={dailyReports}
              loadingReports={loadingReports}
              onRefresh={loadPatientReports}
              onGoToEvaluation={() => setActiveTab('CAPTURE')}
            />
          )}

          {activeTab === 'PHARMACY' && (
            <PharmacyTab
              recoveryDay={recoveryDay}
              latestReport={dailyReports[0]}
            />
          )}

          {activeTab === 'ORDERS' && (
            <OrdersTab
              doctorRestrictions={doctorRestrictions}
              recoveryDay={recoveryDay}
              totalDays={totalDays}
              daysRemaining={daysRemaining}
              progressPercent={progressPercent}
              onRefresh={fetchPatientRestrictions}
            />
          )}

          {activeTab === 'PROFILE' && (
            <PatientProfileTab
              user={user}
              fullName={fullName}
              setFullName={setFullName}
              cedula={cedula}
              setCedula={setCedula}
              phone={phone}
              setPhone={setPhone}
              bloodType={bloodType}
              setBloodType={setBloodType}
              emergencyContact={emergencyContact}
              setEmergencyContact={setEmergencyContact}
              savingProfile={savingProfile}
              profileMsg={profileMsg}
              onSaveProfile={handleSaveProfile}
              onLogout={onLogout}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTTOM TAB BAR */}
      <View style={[styles.bottomTabBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('CAPTURE')}
          activeOpacity={0.7}
        >
          <Camera size={22} color={activeTab === 'CAPTURE' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'CAPTURE' ? theme.primary : theme.textMuted }]}>
            Evaluación
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('REPORTS')}
          activeOpacity={0.7}
        >
          <FileCheck size={22} color={activeTab === 'REPORTS' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'REPORTS' ? theme.primary : theme.textMuted }]}>
            Reportes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('PHARMACY')}
          activeOpacity={0.7}
        >
          <ShieldCheck size={22} color={activeTab === 'PHARMACY' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'PHARMACY' ? theme.primary : theme.textMuted }]}>
            Farmacia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('ORDERS')}
          activeOpacity={0.7}
        >
          <FileText size={22} color={activeTab === 'ORDERS' ? theme.primary : theme.textMuted} />
          <Text style={[styles.tabBtnLabel, { color: activeTab === 'ORDERS' ? theme.primary : theme.textMuted }]}>
            Órdenes
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
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  bottomTabBar: {
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

