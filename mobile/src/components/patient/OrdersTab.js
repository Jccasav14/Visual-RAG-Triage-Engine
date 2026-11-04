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