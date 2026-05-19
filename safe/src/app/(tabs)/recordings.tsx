import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function RecordingsScreen() {
  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ThemedText type="subtitle">Recordings</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            View your recent safety recordings and audio logs from emergency sessions.
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  center: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
  },
});
