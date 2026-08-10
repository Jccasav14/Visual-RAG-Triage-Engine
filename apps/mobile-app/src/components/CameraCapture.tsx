import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, ThemeColors } from './ui';

export const CameraCapture: React.FC<{ onCapture: () => void }> = ({ onCapture }) => (
  <View style={styles.box}>
    <Text style={styles.preview}>[ CAMERA LIVE PREVIEW ]</Text>
    <Button title="Capture & Analyze Image" onPress={onCapture} />
  </View>
);

const styles = StyleSheet.create({
  box: { height: 240, justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#020617', borderRadius: 12 },
  preview: { color: ThemeColors.textSecondary, marginTop: 60 }
});
