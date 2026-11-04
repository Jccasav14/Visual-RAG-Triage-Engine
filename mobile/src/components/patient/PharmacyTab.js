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
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.itemRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.itemName, { color: theme.text }]}>
              Clorhexidina Solución 2% 120ml
            </Text>
            <Text style={[styles.itemSub, { color: theme.primary }]}>
              Cruz Azul • Entrega Inmediata
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.itemPrice}>$3.20</Text>
            <TouchableOpacity
              style={[styles.buyBtn, { backgroundColor: theme.primaryBg }]}
              onPress={() => Linking.openURL('https://cruzazul.ec').catch(() => Alert.alert('Farmacia', 'Disponible en Cruz Azul.'))}
            >
              <Text style={[styles.buyBtnText, { color: theme.primary }]}>
                Pedir Online ↗
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 5. INSUMO RECOMENDADO #2 */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.itemRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.itemName, { color: theme.text }]}>
              Apósito Tegaderm Impermeable 3M
            </Text>
            <Text style={[styles.itemSub, { color: theme.primary }]}>
              Fybeca • Entrega en 30 min
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.itemPrice}>$4.50</Text>
            <TouchableOpacity
              style={[styles.buyBtn, { backgroundColor: theme.primaryBg }]}
              onPress={() => Linking.openURL('https://www.fybeca.com').catch(() => Alert.alert('Farmacia', 'Disponible en Fybeca.'))}
            >
              <Text style={[styles.buyBtnText, { color: theme.primary }]}>
                Pedir Online ↗
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  heading: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  aiTag: { fontSize: 12, fontWeight: '800', color: '#0f766e' },
  aiText: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  priceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: { fontSize: 13, fontWeight: '700' },
  savingsTag: { fontSize: 11, fontWeight: '800', color: '#059669' },
  bestPriceBox: {
    flex: 1,
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  bestPriceLabel: { fontSize: 11, fontWeight: '700', color: '#065f46' },
  bestPriceValue: { fontSize: 18, fontWeight: '900', color: '#059669', marginVertical: 2 },
  bestPriceSub: { fontSize: 10.5, color: '#047857' },
  standardPriceBox: { flex: 1, padding: 12, borderRadius: 10 },
  standardPriceLabel: { fontSize: 11, fontWeight: '700' },
  standardPriceValue: { fontSize: 18, fontWeight: '900', marginVertical: 2 },
  standardPriceSub: { fontSize: 10.5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 14, fontWeight: '700' },
  itemSub: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  itemPrice: { fontSize: 18, fontWeight: '900', color: '#0d9488' },
  buyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 4,
  },
  buyBtnText: { fontSize: 11, fontWeight: '800' },
});

