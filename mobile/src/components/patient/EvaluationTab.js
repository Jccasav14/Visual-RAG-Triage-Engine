import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  Camera,
  Image as ImageIcon,
  Plus,
  X,
  Sparkles,
  Activity,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export const EvaluationTab = ({
  doctorRestrictions,
  recoveryDay,
  totalDays,
  progressPercent,
  selectedImages,
  symptoms,
  setSymptoms,
  evaluating,
  onTakePhoto,
  onPickGallery,
  onPromptAddPhoto,
  onRemoveImage,
  onSubmitEvaluation,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. INFORMACIÓN CLÍNICA DEL PACIENTE */}
      <View style={[styles.surgeryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>