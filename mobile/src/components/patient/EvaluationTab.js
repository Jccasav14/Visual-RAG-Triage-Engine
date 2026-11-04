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
        <View style={styles.surgeryHeader}>
          <View style={[styles.surgeryIconBox, { backgroundColor: theme.primaryBg }]}>
            <Activity size={18} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.surgeryTitle, { color: theme.text }]}>
              {doctorRestrictions?.surgeryType || 'Cirugía Postoperatoria'}
            </Text>
            <Text style={[styles.surgerySub, { color: theme.textMuted }]}>
              Reposo: Día {recoveryDay} de {totalDays}
            </Text>
          </View>
          <View style={[styles.progressBadge, { backgroundColor: theme.primaryBg }]}>
            <Text style={[styles.progressBadgeText, { color: theme.primary }]}>{progressPercent}%</Text>
          </View>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.cardSub }]}>
          <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: theme.primary }]} />
        </View>
      </View>

      {/* PASO 1: CUANDO AÚN NO HA INGRESADO NINGUNA FOTO */}
      {selectedImages.length === 0 ? (
        <View style={[styles.photoCardBlockExpanded, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.captureBoxTargetExpanded, { backgroundColor: theme.cardSub, borderColor: theme.border }]}
            onPress={onTakePhoto}
            activeOpacity={0.85}
          >
            <View style={[styles.cameraBadgeCircleLarge, { backgroundColor: theme.primaryBg }]}>
              <Camera size={44} color={theme.primary} />
            </View>
            <Text style={[styles.capturePromptLarge, { color: theme.text }]}>Tomar Fotografía</Text>
            <Text style={[styles.captureSubPrompt, { color: theme.textMuted }]}>
              Puedes ingresar de 1 a 4 fotos de tu incisión
            </Text>
          </TouchableOpacity>

          <View style={styles.twinButtonsRow}>
            <TouchableOpacity
              style={[styles.twinBtnPrimary, { backgroundColor: theme.primary }]}
              onPress={onTakePhoto}
            >
              <Camera size={18} color="#FFFFFF" />
              <Text style={styles.twinBtnPrimaryText}>Abrir Cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.twinBtnSecondary, { backgroundColor: theme.cardSub, borderColor: theme.border }]}
              onPress={onPickGallery}
            >
              <ImageIcon size={18} color={theme.text} />
              <Text style={[styles.twinBtnSecondaryText, { color: theme.text }]}>Galería</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* PASO 2: GRILLA CENTRADA DE FOTOS + SÍNTOMAS */
        <View style={{ gap: 14 }}>
          <View style={[styles.photoCardBlock, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.photosHeaderRow}>
              <Text style={[styles.photosHeaderTitle, { color: theme.text }]}>
                Fotos de la Incisión ({selectedImages.length}/4):
              </Text>
              {selectedImages.length < 4 && (
                <TouchableOpacity
                  style={[styles.addMoreMiniBtn, { backgroundColor: theme.primaryBg }]}
                  onPress={onPromptAddPhoto}
                >
                  <Plus size={14} color={theme.primary} />
                  <Text style={[styles.addMoreMiniText, { color: theme.primary }]}>Agregar Foto</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.multiPhotosGrid}>
              {selectedImages.map((uri, index) => (
                <View
                  key={index}
                  style={