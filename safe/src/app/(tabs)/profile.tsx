import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeMode } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

const trustedContacts = [
  { name: 'Mom', role: 'Emergency Contact', status: 'Active' },
  { name: 'Alex', role: 'Partner', status: 'Active' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();

  const dynamicSettings = [
    { label: 'Theme', description: mode === 'light' ? 'Light mode' : 'Dark mode', icon: '🌓', action: toggleTheme },
    { label: 'Notifications', description: 'Manage alerts', icon: '🔔' },
    { label: 'Privacy & Security', description: 'Location, data settings', icon: '🔒' },
    { label: 'Help & Support', description: 'FAQ, contact us', icon: '❓' },
  ];

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <View>
              <ThemedText type="subtitle">Profile</ThemedText>
            </View>
            <Pressable style={styles.headerAction}>
              <ThemedText type="default">⚙️</ThemedText>
            </Pressable>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarPlaceholder}>
                <ThemedText type="default">SJ</ThemedText>
              </View>
              <View style={styles.profileInfo}>
                <ThemedText type="default" style={styles.profileName}>
                  Sarah Johnson
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  sarah.johnson@email.com
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  +1 (555) 123-4567
                </ThemedText>
              </View>
              <Pressable style={styles.editButton}>
                <ThemedText type="default">✏️</ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="default" style={styles.sectionTitle}>
                Trusted Contacts
              </ThemedText>
            </View>
            {trustedContacts.map((contact) => (
              <View key={contact.name} style={styles.contactRow}>
                <View style={styles.contactAvatar}>
                  <ThemedText type="default">{contact.name[0]}</ThemedText>
                </View>
                <View style={styles.contactInfo}>
                  <ThemedText type="default" style={styles.contactName}>
                    {contact.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {contact.role}
                  </ThemedText>
                </View>
                <ThemedText type="smallBold" style={styles.contactStatus}>
                  {contact.status}
                </ThemedText>
              </View>
            ))}
            <Pressable style={styles.addContactButton}>
              <ThemedText type="default" style={styles.addContactText}>
                + Add Trusted Contact
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            {dynamicSettings.map((item) => (
              <Pressable
                key={item.label}
                style={styles.settingRow}
                onPress={item.action}
              >
                <View style={styles.settingIcon}>
                  <ThemedText type="default">{item.icon}</ThemedText>
                </View>
                <View style={styles.settingInfo}>
                  <ThemedText type="default" style={styles.settingLabel}>
                    {item.label}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.description}
                  </ThemedText>
                </View>
                <ThemedText type="default">›</ThemedText>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText type="default" style={styles.logoutText}>
              Logout
            </ThemedText>
          </Pressable>
          <Pressable style={styles.deleteButton}>
            <ThemedText type="default" style={styles.deleteText}>
              Delete Account
            </ThemedText>
          </Pressable>
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
    padding: Spacing.four,
    gap: Spacing.four,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    backgroundColor: '#fff',
    borderRadius: Spacing.four,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f6e6df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#f7e9e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  profileName: {
    fontWeight: '700',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f3ede7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    gap: Spacing.three,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.two,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f7e9e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  contactName: {
    fontWeight: '700',
  },
  contactStatus: {
    color: '#2f6b5b',
  },
  addContactButton: {
    marginTop: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#f1c4b8',
    alignItems: 'center',
  },
  addContactText: {
    color: '#c8554f',
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingVertical: Spacing.three,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f7e9e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  settingLabel: {
    fontWeight: '700',
  },
  logoutButton: {
    padding: Spacing.four,
    borderRadius: Spacing.five,
    backgroundColor: '#c8554f',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
  deleteButton: {
    padding: Spacing.four,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: '#f1b5aa',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  deleteText: {
    color: '#c8554f',
    fontWeight: '700',
  },
});
