import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type AppLogoProps = {
  size?: number;
};

export function AppLogo({ size = 56 }: AppLogoProps) {
  const badgeSize = Math.round(size * 0.42);

  return (
    <View style={[styles.logo, { width: size, height: size, borderRadius: size / 2 }]}> 
      <ThemedText type="title" style={[styles.heart, { fontSize: Math.round(size * 0.7) }]}>❤️</ThemedText>
      <View style={[styles.lockBadge, { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }]}> 
        <ThemedText type="smallBold" style={styles.lock}>🔒</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: '#c8554f',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heart: {
    color: '#fff',
    marginBottom: -4,
  },
  lockBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lock: {
    color: '#c8554f',
    marginBottom: 2,
  },
});
