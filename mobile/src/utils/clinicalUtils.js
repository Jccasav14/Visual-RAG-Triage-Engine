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
  if (lower.includes('normal') || lower.includes('suture') || lower.includes('eutr')) return 'Cicatrización Normal';
  return 'Evolución Quirúrgica Normal';
};

// Semáforo clínico visual para el paciente (sin porcentajes técnicos de certeza)
export const getClinicalBadge = (severity, className = '') => {
  const c = String(className).toLowerCase();
  const s = String(severity).toUpperCase();
  if (s === 'HIGH' || s === 'CRITICAL' || c.includes('infecci') || c.includes('dehiscenc') || c.includes('necros') || c.includes('bleed')) {
    return { text: 'Atención Requerida', bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' };
  }
  if (s === 'MEDIUM' || c.includes('eritema') || c.includes('seroma') || c.includes('hematoma') || c.includes('allerg')) {
    return { text: 'En Observación', bg: '#fefce8', color: '#a16207', dot: '#eab308' };
  }
  return { text: 'Evolución Favorable', bg: '#ecfdf5', color: '#059669', dot: '#10b981' };
};


// commit step: 76

// commit step: 80

// commit step: 114

// commit step: 115

// commit step: 116

// commit step: 136

// commit step: 137

// commit step: 138

// commit step: 139

// commit step: 140

// commit step: 141

// commit step: 142

// commit step: 143

// commit step: 144

// commit step: 145

// commit step: 146

// commit step: 147

// commit step: 148

// commit step: 149

// commit step: 150

// commit step: 151

// commit step: 152
