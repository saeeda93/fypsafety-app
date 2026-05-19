import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function TrackingScreen() {
  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ThemedText type="subtitle">Tracking</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            Monitor active journeys, location history, and safety boundaries from one place.
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
