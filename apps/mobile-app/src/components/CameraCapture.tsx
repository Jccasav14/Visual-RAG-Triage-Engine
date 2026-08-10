import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, ThemeColors } from './ui';

export const CameraCapture: React.FC<{ onCapture: () => void }> = ({ onCapture }) => (
  <View style={styles.viewfinder}>
    <View style={styles.hudTop}>
      <Text style={styles.hudText}>● LIVE CAMERA FEED [EDGE ML ONNX]</Text>
      <Text style={styles.hudTextRight}>FPS: 60</Text>
    </View>

    <View style={styles.targetRing}>
      <View style={styles.cornerTL} />
      <View style={styles.cornerTR} />
      <View style={styles.cornerBL} />
      <View style={styles.cornerBR} />
      <Text style={styles.scanText}>ALIGN OBJECT FOR VISUAL TRIAGE</Text>
    </View>

    <Button title="📸 CAPTURE & EXECUTE EDGE TRIAGE" onPress={onCapture} variant="primary" />
  </View>
);

const styles = StyleSheet.create({
  viewfinder: {
    height: 320,
    justify: 'space-between',
    padding: 16,
    backgroundColor: '#020617',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  hudTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  hudText: { color: ThemeColors.success, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  hudTextRight: { color: ThemeColors.textMuted, fontSize: 11, fontWeight: '700' },
  targetRing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 12,
  },
  scanText: { color: ThemeColors.primaryBright, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  cornerTL: { position: 'absolute', top: 8, left: 8, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: ThemeColors.primaryBright },
  cornerTR: { position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderTopWidth: 2, borderRightWidth: 2, borderColor: ThemeColors.primaryBright },
  cornerBL: { position: 'absolute', bottom: 8, left: 8, width: 16, height: 16, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: ThemeColors.primaryBright },
  cornerBR: { position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: ThemeColors.primaryBright },
});
