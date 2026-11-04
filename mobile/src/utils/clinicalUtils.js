import { Platform, StatusBar } from 'react-native';

export const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

// Utilidad para limpiar nombres de diagnóstico a español 100% amigable y sin tecnicismos en inglés
export const formatWoundClass = (className) => {
  if (!className) return 'Cicatrización Normal';
  const raw = String(className).trim().toUpperCase();

  const directMap = {
    'EXCESSIVE_HYPERLOGIC_SCAR': 'Cicatrización Hipertrófica',
    'NORMAL_SUTURE_HEALING': 'Cicatrización Normal',
    'SEROMA_FLUID_ACCUMULATION': 'Seroma / Líquido Acumulado',
    'ERYTHEMA_MILD_INFLAMMATION': 'Eritema / Inflamación Leve',
    'HEMATOMA_BRUISING': 'Hematoma Subcutáneo',
    'SURGICAL_SITE_INFECTION_PURULENT': 'Infección de Sutura',