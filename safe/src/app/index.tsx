import { Link } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function SplashScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.brandContainer}>
          <View style={styles.iconShell}>
            <View style={styles.iconCircle}>
              <ThemedText type="title" style={styles.iconLabel}>
                ⛨
              </ThemedText>
            </View>
          </View>

          <ThemedText type="title" style={styles.title}>
            You’re Never Alone
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle} themeColor="textSecondary">
            Your safety starts here.
          </ThemedText>
        </View>

        <View style={styles.buttonsContainer}>
          <Link href="/login" asChild>
            <Pressable style={styles.primaryButton}>
              <ThemedText type="default" style={styles.primaryText}>
                Sign In
              </ThemedText>
            </Pressable>
          </Link>

          <Link href="/signup" asChild>
            <Pressable style={styles.secondaryButton}>
              <ThemedText type="default" style={styles.secondaryButtonText}>
                Sign Up
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'space-between',
  },
  brandContainer: {
    alignItems: 'center',
    gap: Spacing.four,
    marginTop: Spacing.six,
  },
  iconShell: {
    width: 128,
    height: 128,
    borderRadius: 72,
    backgroundColor: '#EAC6B7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 48,
    backgroundColor: '#F6E2DA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
    lineHeight: 52,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 320,
  },
  buttonsContainer: {
    gap: Spacing.three,
    marginBottom: Spacing.six,
  },
  primaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.four,
    backgroundColor: '#c8554f',
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8554f',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: '700',
  },
});
