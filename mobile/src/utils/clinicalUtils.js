import { Platform, StatusBar } from 'react-native';

export const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

// Utilidad para limpiar nombres de diagnóstico a español 100% amigable y sin tecnicismos en inglés
export const formatWoundClass = (className) => {
  if (!className) return 'Cicatrización Normal';
  const raw = String(className).trim().toUpperCase();