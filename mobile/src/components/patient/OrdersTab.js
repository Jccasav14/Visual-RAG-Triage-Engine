import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Calendar,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export const OrdersTab = ({
  doctorRestrictions,
  recoveryDay,
  totalDays,
  daysRemaining,
  progressPercent,
  onRefresh,
}) => {
  const { theme } = useTheme();

  const parseListItems = (text) => {
    if (!text) return [];
    return text
      .split(/\n|\. |\;/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2);
  };

  const prohibitionsList = parseListItems(doctorRestrictions?.prohibitions);
  const careList = parseListItems(doctorRestrictions?.allowedActions);
  const emergencyList = parseListItems(doctorRestrictions?.emergencyThresholds);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionHeading, { color: theme.text }]}>Órdenes de Recuperación</Text>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={{ padding: 6 }}>
            <RefreshCw size={20} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      {doctorRestrictions ? (
        <View style={{ gap: 14 }}>
          {/* 1. CRONOGRAMA */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryBg }]}>
                <Calendar size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {doctorRestrictions.surgeryType || 'Cirugía Programada'}
                </Text>
                <Text style={[styles.cardSub, { color: theme.textMuted }]}>
                  Inicio: {doctorRestrictions.startDate || 'No especificada'}
                </Text>
              </View>
              <View style={[styles.badgePill, { backgroundColor: theme.primaryBg }]}>
                <Text style={[styles.badgePillText, { color: theme.primary }]}>{progressPercent}%</Text>
              </View>
            </View>

            <View style={[styles.progressTrack, { backgroundColor: theme.cardSub }]}>
              <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: theme.primary }]} />
            </View>

            <View style={[styles.metricsRow, { borderTopColor: theme.cardSub }]}>
              <View style={styles.metricCol}>
                <Text style={[styles.metricColLbl, { color: theme.textMuted }]}>DÍA ACTUAL</Text>
                <Text style={[styles.metricColVal, { color: theme.text }]}>Día {recoveryDay}</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={[styles.metricColLbl, { color: theme.textMuted }]}>REPOSO TOTAL</Text>
                <Text style={[styles.metricColVal, { color: theme.text }]}>{totalDays} Días</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={[styles.metricColLbl, { color: theme.textMuted }]}>DÍAS RESTANTES</Text>
                <Text style={[styles.metricColVal, { color: theme.primary }]}>{daysRemaining} Días</Text>
              </View>
            </View>
          </View>

          {/* 2. ACCIONES PROHIBIDAS (SIN EMOJIS, FONDO MINT EN ÍCONO COMO EN LA FOTO) */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryBg }]}>
                <Ban size={20} color={theme.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Acciones Prohibidas</Text>
            </View>

            {prohibitionsList.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No hay prohibiciones específicas registradas.
              </Text>
            ) : (
              <View style={styles.listWrap}>
                {prohibitionsList.map((item, idx) => (
                  <View key={idx} style={[styles.itemRow, { backgroundColor: theme.cardSub }]}>
                    <Text style={[styles.itemText, { color: theme.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 3. CUIDADOS PERMITIDOS (SIN EMOJIS, FONDO MINT EN ÍCONO COMO EN LA FOTO) */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryBg }]}>
                <CheckCircle2 size={20} color={theme.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Cuidados Permitidos</Text>
            </View>

            {careList.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No hay cuidados específicos registrados.
              </Text>
            ) : (
              <View style={styles.listWrap}>
                {careList.map((item, idx) => (
                  <View key={idx} style={[styles.itemRow, { backgroundColor: theme.cardSub }]}>
                    <Text style={[styles.itemText, { color: theme.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 4. SEÑALES DE ALERTA Y ALERGIAS (SIN EMOJIS) */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryBg }]}>
                <AlertTriangle size={20} color={theme.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Señales de Alerta & Alergias</Text>
            </View>

            {emergencyList.length === 0 && !doctorRestrictions.allergies ? (
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                Sin señales de alarma adicionales.
              </Text>
            ) : (
              <View style={styles.listWrap}>
                {emergencyList.map((item, idx) => (
                  <View key={idx} style={[styles.itemRow, { backgroundColor: theme.cardSub }]}>
                    <Text style={[styles.itemText, { color: theme.text }]}>{item}</Text>
                  </View>
                ))}
                {!!doctorRestrictions.allergies && (
                  <View style={[styles.itemRow, { backgroundColor: theme.cardSub }]}>
                    <Text style={[styles.itemText, { color: theme.text, fontWeight: '700' }]}>
                      Alergias: {doctorRestrictions.allergies}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Stethoscope size={38} color={theme.textMuted} />
          <Text style={[styles.emptyBoxTitle, { color: theme.text }]}>Sin órdenes asignadas</Text>
          <Text style={[styles.emptyBoxDesc, { color: theme.textMuted }]}>
            Tu cirujano tratante aún no ha registrado la ficha clínica para tu procedimiento.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricColLbl: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metricColVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  listWrap: {
    marginTop: 14,
    gap: 10,
  },
  itemRow: {
    padding: 14,
    borderRadius: 12,
  },
  itemText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 13,
    marginTop: 10,
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyBoxDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
