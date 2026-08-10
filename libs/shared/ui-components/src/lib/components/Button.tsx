import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeColors } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity
    style={[styles.btn, variant === 'secondary' ? styles.secondary : styles.primary]}
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: { padding: 14, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: ThemeColors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: ThemeColors.primary },
  text: { color: '#fff', fontWeight: '600', fontSize: 16 }
});
