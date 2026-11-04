import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatWoundClass } from '../../utils/clinicalUtils';

export const PharmacyTab = ({ recoveryDay, latestReport }) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. ENCABEZADO MINIMALISTA */}
      <View style={{ marginBottom: 4 }}>
        <Text style={[styles.heading, { color: theme.text }]}>
          Farmacia & Insumos
        </Text>
        <Text style={{ fontSize: 13, color: theme.textMuted }}>
          Día {recoveryDay} de reposo • {formatWoundClass(latestReport?.classification)}
        </Text>
      </View>

      {/* 2. CONSEJO INTELIGENTE IA */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#132b2a' : '#f0fdfa',
            borderColor: '#99f6e4',
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Sparkles size={16} color="#0d9488" />
          <Text style={styles.aiTag}>
            Consejo de Recuperación IA
          </Text>