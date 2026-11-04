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
    'WOUND_DEHISCENCE': 'Dehiscencia de Sutura',
    'NECROTIC_TISSUE': 'Tejido Desvitalizado',
    'ALLERGIC_DERMATITIS_ADHESIVE': 'Dermatitis por Adhesivo',
    'EMERGENCY_BLEEDING_OPEN_WOUND': 'Sangrado en Incisión',
  };

  if (directMap[raw]) return directMap[raw];

  const lower = raw.toLowerCase();
  if (lower.includes('hyper') || lower.includes('queloide') || lower.includes('keloid') || lower.includes('scar')) return 'Cicatrización Hipertrófica';
  if (lower.includes('dehiscenc') || lower.includes('separaci')) return 'Dehiscencia de Sutura';
  if (lower.includes('infect') || lower.includes('purulent') || lower.includes('infecci')) return 'Infección de Sutura';
  if (lower.includes('seroma') || lower.includes('fluid')) return 'Seroma / Líquido Acumulado';
  if (lower.includes('hematoma') || lower.includes('bruis')) return 'Hematoma Subcutáneo';
  if (lower.includes('erythem') || lower.includes('eritem')) return 'Eritema / Inflamación Leve';
  if (lower.includes('dermatit') || lower.includes('allerg')) return 'Dermatitis por Adhesivo';
  if (lower.includes('necrot') || lower.includes('esfacel')) return 'Tejido Desvitalizado';
  if (lower.includes('bleed') || lower.includes('sangr')) return 'Sangrado en Incisión';