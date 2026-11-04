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
        </View>
        <Text style={[styles.aiText, { color: theme.text }]}>
          {latestReport?.plan
            ? latestReport.plan.split('\n')[0].slice(0, 110) + '...'
            : 'Mantén la incisión seca y limpia. Aplica gasa estéril tras el lavado fisiológico.'}
        </Text>
      </View>

      {/* 3. COMPARATIVA VISUAL DE PRECIOS */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.priceHeaderRow}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Comparativa de Precios
          </Text>
          <Text style={styles.savingsTag}>
            Ahorras $0.95 en este insumo
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={styles.bestPriceBox}>
            <Text style={styles.bestPriceLabel}>Cruz Azul</Text>
            <Text style={styles.bestPriceValue}>$3.20</Text>
            <Text style={styles.bestPriceSub}>Precio Más Bajo</Text>
          </View>

          <View style={[styles.standardPriceBox, { backgroundColor: theme.cardSub }]}>
            <Text style={[styles.standardPriceLabel, { color: theme.text }]}>Fybeca</Text>
            <Text style={[styles.standardPriceValue, { color: theme.text }]}>$4.15</Text>
            <Text style={[styles.standardPriceSub, { color: theme.textMuted }]}>Entrega en 30 min</Text>
          </View>
        </View>
      </View>

      {/* 4. INSUMO RECOMENDADO #1 */}