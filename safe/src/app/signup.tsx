import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import { useUser } from '@/hooks/use-user';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const { registerUser } = useUser();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [formError, setFormError] = useState('');

  const handleCreateAccount = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setFormError('Name, email, and password are required.');
      return;
    }

    if (!agree) {
      setFormError('You must agree to the terms to continue.');
      return;
    }

    registerUser({
      name: trimmedName,
      email: trimmedEmail,
      phone: phone.trim() || '+1 (555) 000-0000',
      password: trimmedPassword,
    });

    router.replace('/home?showPermissions=1');
  };

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.brandTitle}>
            Create Account
          </ThemedText>
          <ThemedText type="small" style={styles.brandSubtitle} themeColor="textSecondary">
            Join SafeGuard to stay connected with your trusted contacts.
          </ThemedText>

          <ThemedView style={styles.card}>
            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                Full Name
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                Phone Number
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                Email
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                Password
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.checkboxRow}>
              <Switch value={agree} onValueChange={setAgree} thumbColor={agree ? '#c8554f' : '#ccc'} />
              <View style={styles.checkboxText}> 
                <ThemedText type="small" themeColor="textSecondary">
                  I agree to the{' '}
                  <ThemedText type="linkPrimary">Terms of Service</ThemedText> and{' '}
                  <ThemedText type="linkPrimary">Privacy Policy</ThemedText>.
                </ThemedText>
              </View>
            </View>

            <Pressable
              style={[styles.primaryButton, (!agree || !fullName.trim() || !email.trim() || !password.trim()) && styles.disabledButton]}
              disabled={!agree || !fullName.trim() || !email.trim() || !password.trim()}
              onPress={handleCreateAccount}
            >
              <ThemedText type="default" style={styles.primaryButtonText}>
                Create Account
              </ThemedText>
            </Pressable>
            {formError ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.errorText}>
                {formError}
              </ThemedText>
            ) : null}

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
                Already have an account?
              </ThemedText>
              <Link href="/login" asChild>
                <Pressable>
                  <ThemedText type="linkPrimary" style={styles.linkText}>
                    Sign In
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  checkboxText: {
    flex: 1,
  },
  primaryButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  disabledButton: {
    opacity: 0.5,
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
    color: '#c8554f',
    marginTop: Spacing.two,
  },
  linkText: {
    fontWeight: '700',
  },
});
