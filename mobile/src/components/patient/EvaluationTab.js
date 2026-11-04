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
                    selectedImages.length === 1
                      ? styles.photoSingleItem
                      : styles.photoGridItem
                  }
                >
                  <Image
                    source={{ uri }}
                    style={
                      selectedImages.length === 1
                        ? styles.photoSingleThumbnail
                        : styles.photoGridThumbnail
                    }
                  />
                  <TouchableOpacity
                    style={styles.deletePhotoCircle}
                    onPress={() => onRemoveImage(index)}
                  >
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                  <View style={styles.photoIndexBadge}>
                    <Text style={styles.photoIndexText}>#{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* SÍNTOMAS Y ANALIZAR */}
          <View style={[styles.symptomsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.symptomsCardHeading, { color: theme.text }]}>
              ¿Presentas alguna molestia hoy?
            </Text>
            <Text style={[styles.symptomsCardSub, { color: theme.textMuted }]}>
              Describe si sientes dolor, ardor, secreción o tirantez:
            </Text>
            <TextInput
              style={[
                styles.symptomsInput,
                {
                  backgroundColor: theme.cardSub,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Ej: Siento leve tirantez y picazón al caminar..."
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={3}
              value={symptoms}
              onChangeText={setSymptoms}
            />

            <TouchableOpacity
              style={[
                styles.evaluateButton,
                { backgroundColor: theme.primary },
                evaluating && { opacity: 0.7 },
              ]}
              onPress={onSubmitEvaluation}
              disabled={evaluating}
            >
              {evaluating ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.evaluateButtonText}>Analizando Incisión con IA...</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#FFFFFF" />
                  <Text style={styles.evaluateButtonText}>Analizar Herida con IA</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: 14 },
  surgeryCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  surgeryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  surgeryIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  surgeryTitle: { fontSize: 15, fontWeight: '800' },
  surgerySub: { fontSize: 12, marginTop: 1 },
  progressBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  progressBadgeText: { fontSize: 12, fontWeight: '800' },
  progressTrack: { height: 6, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  photoCardBlockExpanded: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 450,
  },
  captureBoxTargetExpanded: {
    width: '100%',
    flex: 1,
    minHeight: 330,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cameraBadgeCircleLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  capturePromptLarge: { fontSize: 18, fontWeight: '800' },
  captureSubPrompt: { fontSize: 13, marginTop: 6, textAlign: 'center', maxWidth: 240 },
  twinButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  twinBtnPrimary: { flex: 1, height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  twinBtnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  twinBtnSecondary: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  twinBtnSecondaryText: { fontSize: 14, fontWeight: '700' },
  photoCardBlock: { borderRadius: 16, padding: 16, borderWidth: 1 },
  photosHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  photosHeaderTitle: { fontSize: 14, fontWeight: '700' },
  addMoreMiniBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addMoreMiniText: { fontSize: 12, fontWeight: '700' },
  multiPhotosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  photoSingleItem: { width: '100%', height: 210, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  photoSingleThumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoGridItem: { width: '47%', height: 135, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  photoGridThumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  deletePhotoCircle: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.65)', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  photoIndexBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  photoIndexText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  symptomsCard: { borderRadius: 16, padding: 16, borderWidth: 1 },
  symptomsCardHeading: { fontSize: 15, fontWeight: '800' },
  symptomsCardSub: { fontSize: 12, marginTop: 2, marginBottom: 10 },
  symptomsInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 13, minHeight: 70, textAlignVertical: 'top' },
  evaluateButton: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  evaluateButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});

