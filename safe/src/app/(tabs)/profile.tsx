import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import ActualMap from '../../components/actual-map';

import { useLocationSharing } from '@/hooks/use-location';
import { useUser } from '@/hooks/use-user';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeMode } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { mode, toggleTheme } = useThemeMode();
  const { consentGranted, location, error, loading, enableLocationSharing, refreshLocation } = useLocationSharing();
  const { user, setUser, addContactByCode, logout } = useUser();
  const contacts = user.contacts ?? [];

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.name);
  const [draftEmail, setDraftEmail] = useState(user.email);
  const [draftPhone, setDraftPhone] = useState(user.phone);
  const [newContactCode, setNewContactCode] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [contactStatusMessage, setContactStatusMessage] = useState('');
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);

  const handleAddContact = () => {
    const result = addContactByCode(newContactCode, newContactRole.trim() || 'Trusted Contact');

    setContactStatusMessage(result.message);

    if (result.success) {
      setNewContactCode('');
      setNewContactRole('');
    }
  };

  useEffect(() => {
    setDraftName(user.name);
    setDraftEmail(user.email);
    setDraftPhone(user.phone);
  }, [user.name, user.email, user.phone]);

  const handleOpenNotifications = () => setNotificationsVisible(true);
  const handleOpenPrivacy = () => setPrivacyVisible(true);
  const handleOpenHelp = () => setHelpVisible(true);

  const defaultCenter = { latitude: 37.7749, longitude: -122.4194 };
  const mapCenter = location?.coords ?? defaultCenter;
  const profileRegion = {
    latitude: mapCenter.latitude,
    longitude: mapCenter.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const dynamicSettings = [
    { label: 'Theme', description: mode === 'light' ? 'Light mode' : 'Dark mode', icon: '🌓', action: toggleTheme },
    { label: 'Notifications', description: 'Manage alerts', icon: '🔔', action: handleOpenNotifications },
    { label: 'Privacy & Security', description: 'Location, data settings', icon: '🔒', action: handleOpenPrivacy },
    { label: 'Help & Support', description: 'FAQ, contact us', icon: '❓', action: handleOpenHelp },
  ];

  const handleLogout = () => {
    logout();
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
                <ThemedText type="default">
                  {user.name
                    .split(' ')
                    .filter(Boolean)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.profileInfo}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.profileInput}
                      value={draftName}
                      onChangeText={setDraftName}
                      placeholder="Full name"
                    />
                    <TextInput
                      style={styles.profileInput}
                      value={draftEmail}
                      onChangeText={setDraftEmail}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <TextInput
                      style={styles.profileInput}
                      value={draftPhone}
                      onChangeText={setDraftPhone}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                    />
                  </>
                ) : (
                  <>
                    <ThemedText type="default" style={styles.profileName}>
                      {user.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {user.email}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {user.phone}
                    </ThemedText>
                    <ThemedText type="smallBold" themeColor="textSecondary" style={styles.userCode}>
                      My code: {user.uniqueCode}
                    </ThemedText>
                  </>
                )}
              </View>
              <View style={styles.profileActions}>
                {isEditing ? (
                  <>
                    <Pressable
                      style={[styles.controlButton, styles.saveButton]}
                      onPress={() => {
                        setUser({
                          ...user,
                          name: draftName.trim() || 'SafeGuard User',
                          email: draftEmail.trim() || 'user@safe.io',
                          phone: draftPhone.trim() || '+1 (555) 000-0000',
                        });
                        setIsEditing(false);
                      }}
                    >
                      <ThemedText type="default" style={styles.saveButtonText}>
                        Save
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={[styles.controlButton, styles.cancelButton]}
                      onPress={() => {
                        setDraftName(user.name);
                        setDraftEmail(user.email);
                        setDraftPhone(user.phone);
                        setIsEditing(false);
                      }}
                    >
                      <ThemedText type="default" style={styles.cancelButtonText}>
                        Cancel
                      </ThemedText>
                    </Pressable>
                  </>
                ) : (
                  <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <ThemedText type="default">✏️</ThemedText>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <View style={styles.locationPreviewCard}>
            <View style={styles.locationPreviewHeader}>
              <ThemedText type="default" style={styles.sectionTitle}>
                Current Location
              </ThemedText>
              <Pressable onPress={refreshLocation} style={styles.refreshButton}>
                <ThemedText type="small" style={styles.refreshText}>
                  Refresh
                </ThemedText>
              </Pressable>
            </View>
            {!consentGranted ? (
              <View style={styles.locationConsentRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Allow location sharing to show your current position on the map.
                </ThemedText>
                <Pressable style={styles.consentButton} onPress={enableLocationSharing}>
                  <ThemedText type="default" style={styles.consentButtonText}>
                    Enable Location Sharing
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.locationMapWrapper}>
                <ActualMap latitude={mapCenter.latitude} longitude={mapCenter.longitude} radius={0.2} style={styles.locationMap} />
                {loading && (
                  <View style={styles.locationMapOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                    <ThemedText type="small" style={styles.mapLoadingText}>
                      Updating location...
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
            {error ? (
              <View style={styles.locationErrorCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  {error}
                </ThemedText>
              </View>
            ) : consentGranted && location ? (
              <View style={styles.locationDetailsRow}>
                <ThemedText type="smallBold">Lat</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {location.coords.latitude.toFixed(5)}
                </ThemedText>
                <ThemedText type="smallBold">Lng</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {location.coords.longitude.toFixed(5)}
                </ThemedText>
              </View>
            ) : null}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="default" style={styles.sectionTitle}>
                Trusted Contacts
              </ThemedText>
            </View>
            {contacts.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                No contacts added yet. Add one below to keep your safety circle updated.
              </ThemedText>
            ) : (
              contacts.map((contact) => (
                <View key={contact.id} style={styles.contactRow}>
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
              ))
            )}
            <View style={styles.addContactForm}>
              <ThemedText type="small" themeColor="textSecondary">
                Enter the unique app code for a registered contact.
              </ThemedText>
              <TextInput
                style={styles.profileInput}
                placeholder="Contact code (e.g. MG1234)"
                value={newContactCode}
                onChangeText={setNewContactCode}
                autoCapitalize="characters"
              />
              <TextInput
                style={styles.profileInput}
                placeholder="Relationship"
                value={newContactRole}
                onChangeText={setNewContactRole}
              />
              <Pressable style={[styles.controlButton, styles.saveButton]} onPress={handleAddContact}>
                <ThemedText type="default" style={styles.saveButtonText}>
                  Add Contact
                </ThemedText>
              </Pressable>
              {contactStatusMessage ? (
                <ThemedText type="small" themeColor="textSecondary" style={styles.contactMessage}>
                  {contactStatusMessage}
                </ThemedText>
              ) : null}
            </View>
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

          <Modal animationType="fade" transparent visible={notificationsVisible}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeaderRow}>
                  <ThemedText type="subtitle">Notifications</ThemedText>
                  <Pressable style={styles.closeButton} onPress={() => setNotificationsVisible(false)}>
                    <ThemedText type="default">✕</ThemedText>
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="textSecondary" style={styles.modalText}>
                  Manage your alert preferences and review recent notifications from your safety circle.
                </ThemedText>
                <View style={styles.modalSection}>
                  <ThemedText type="default" style={styles.modalSectionTitle}>
                    Alert Preferences
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Toggle emergency alerts, location updates, and tracking notifications for your account.
                  </ThemedText>
                </View>
                <Pressable style={styles.allowButton} onPress={() => setNotificationsVisible(false)}>
                  <ThemedText type="default" style={styles.allowButtonText}>
                    Done
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal animationType="fade" transparent visible={privacyVisible}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeaderRow}>
                  <ThemedText type="subtitle">Privacy & Security</ThemedText>
                  <Pressable style={styles.closeButton} onPress={() => setPrivacyVisible(false)}>
                    <ThemedText type="default">✕</ThemedText>
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="textSecondary" style={styles.modalText}>
                  Control your location sharing and app security settings in one place.
                </ThemedText>
                <View style={styles.modalSection}>
                  <ThemedText type="default" style={styles.modalSectionTitle}>
                    Location Sharing
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Your device location is shared only with trusted contacts after you enable permissions.
                  </ThemedText>
                </View>
                <View style={styles.modalSection}>
                  <ThemedText type="default" style={styles.modalSectionTitle}>
                    Account Security
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Keep your unique code private and update your profile details to keep your account secure.
                  </ThemedText>
                </View>
                <Pressable style={styles.allowButton} onPress={() => setPrivacyVisible(false)}>
                  <ThemedText type="default" style={styles.allowButtonText}>
                    Close
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal animationType="fade" transparent visible={helpVisible}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeaderRow}>
                  <ThemedText type="subtitle">Help & Support</ThemedText>
                  <Pressable style={styles.closeButton} onPress={() => setHelpVisible(false)}>
                    <ThemedText type="default">✕</ThemedText>
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="textSecondary" style={styles.modalText}>
                  Find answers to common questions and contact support if you need help with the app.
                </ThemedText>
                <View style={styles.modalSection}>
                  <ThemedText type="default" style={styles.modalSectionTitle}>
                    FAQ
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Learn how to add trusted contacts, enable tracking, and stay secure while using SafeGuard.
                  </ThemedText>
                </View>
                <View style={styles.modalSection}>
                  <ThemedText type="default" style={styles.modalSectionTitle}>
                    Contact Support
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Email support@safe.io or visit the Help Center for more assistance.
                  </ThemedText>
                </View>
                <Pressable style={styles.allowButton} onPress={() => setHelpVisible(false)}>
                  <ThemedText type="default" style={styles.allowButtonText}>
                    Close
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Modal>
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
  userCode: {
    marginTop: Spacing.one,
    color: '#6f7988',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#f3ede7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInput: {
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: '#e0dfdd',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: '#fff',
    color: '#000',
    width: '100%',
  },
  profileActions: {
    gap: Spacing.two,
    alignItems: 'flex-end',
  },
  controlButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#c8554f',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#f2f4f7',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '700',
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
  locationPreviewCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    gap: Spacing.three,
  },
  locationPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: '#f2f4f7',
  },
  refreshText: {
    color: '#c8554f',
    fontWeight: '700',
  },
  locationConsentRow: {
    gap: Spacing.two,
  },
  locationMapWrapper: {
    width: '100%',
    height: 180,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    backgroundColor: '#e7ecf6',
  },
  locationMap: {
    width: '100%',
    height: '100%',
  },
  locationMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  mapLoadingText: {
    color: '#fff',
  },
  locationDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  consentButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderRadius: Spacing.four,
    backgroundColor: '#c8554f',
  },
  consentButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  locationErrorCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#feeaea',
    borderWidth: 1,
    borderColor: '#f5c6c6',
  },
  sectionHeaderRow: {
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
  addContactForm: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  fieldRow: {
    gap: Spacing.two,
  },
  contactMessage: {
    marginTop: Spacing.two,
    color: '#6f7988',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  modalText: {
    marginTop: Spacing.one,
  },
  modalSection: {
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: '#f2f3f5',
  },
  modalSectionTitle: {
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f7',
  },
  allowButton: {
    marginTop: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: '#c8554f',
    alignItems: 'center',
  },
  allowButtonText: {
    color: '#fff',
    fontWeight: '700',
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
