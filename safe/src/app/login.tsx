import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppLogo } from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUser } from '@/hooks/use-user';
import { Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSignIn = () => {
    const result = login(email.trim(), password);
    if (result.success) {
      router.replace('/home');
    } else {
      setAuthError(result.message);
    }
  };

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <AppLogo size={56} />
            <ThemedText type="title" style={styles.brandTitle}>
              SafeGuard
            </ThemedText>
          </View>
          <ThemedText type="small" style={styles.brandSubtitle} themeColor="textSecondary">
            Your personal safety companion.
          </ThemedText>

          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">Welcome Back</ThemedText>
            <ThemedText type="small" style={styles.cardSubtitle} themeColor="textSecondary">
              Sign in to continue to SafeGuard.
            </ThemedText>

            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                Email Address
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="you.email@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                Password
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <Pressable style={styles.forgotButton} onPress={() => router.push('/signup')}>
              <ThemedText type="link" themeColor="textSecondary">
                Forgot Password?
              </ThemedText>
            </Pressable>

            {authError ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.errorText}>
                {authError}
              </ThemedText>
            ) : null}

            <Pressable style={styles.primaryButton} onPress={handleSignIn}>
              <ThemedText type="default" style={styles.primaryButtonText}>
                Sign In
              </ThemedText>
            </Pressable>

            <ThemedText type="small" style={styles.dividerText}>
              or
            </ThemedText>

            <Pressable style={styles.secondaryButton} onPress={() => {}}>
              <ThemedText type="default" style={styles.secondaryButtonText}>
                Continue with Google
              </ThemedText>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => {}}>
              <ThemedText type="default" style={styles.secondaryButtonText}>
                Continue with Apple
              </ThemedText>
            </Pressable>

            <View style={styles.footerRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Don’t have an account?
              </ThemedText>
              <Link href="/signup" asChild>
                <Pressable>
                  <ThemedText type="linkPrimary" style={styles.linkText}>
                    Create Account
                  </ThemedText>
                </Pressable>
              </Link>
            </View>
          </ThemedView>
        </ScrollView>
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
  },
  content: {
    flexGrow: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  brandTitle: {
    fontSize: 42,
    lineHeight: 48,
  },
  brandSubtitle: {
    marginTop: Spacing.one,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardSubtitle: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  fieldGroup: {
    gap: Spacing.one,
  },
  fieldLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#e0dfdd',
    paddingHorizontal: Spacing.three,
    paddingVertical: Platform.OS === 'web' ? Spacing.two : Spacing.three,
    backgroundColor: '#fff',
    color: '#000',
  },
  forgotButton: {
    alignSelf: 'flex-end',
  },
  primaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  dividerText: {
    textAlign: 'center',
    marginVertical: Spacing.two,
  },
  secondaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#f4f1ee',
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  errorText: {
    color: '#b91c1c',
    marginTop: Spacing.two,
  },
  linkText: {
    fontWeight: '700',
  },
});
