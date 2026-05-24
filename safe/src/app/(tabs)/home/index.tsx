import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import ActualMap from '../../../components/actual-map';
import { AppLogo } from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { useLocationSharing } from '@/hooks/use-location';
import { useUser } from '@/hooks/use-user';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const people = [
  { name: 'Sarah Mitchell', status: 'Active', distance: '0.3 miles away' },
  { name: 'James Cooper', status: 'Active', distance: '1.2 miles away' },
  { name: 'Emily Davis', status: 'Paused', distance: '2.8 miles away' },
];

const activities = [
  { title: 'Sarah arrived safely', time: '2 minutes ago' },
  { title: 'Boundary reminder sent', time: '15 minutes ago' },
  { title: 'James started tracking you', time: '1 hour ago' },
];

const defaultNotifications = [
  {
    title: 'Emergency Alert',
    description: 'Sarah Mitchell requested help nearby.',
    time: '2m ago',
    type: 'emergency',
  },
  {
    title: 'Boundary Crossed',
    description: 'Alex Chen left the safe zone at Riverside Park.',
    time: '15m ago',
    type: 'boundary',
  },
  {
    title: 'Safety Check',
    description: 'Jordan Taylor marked themselves safe.',
    time: '1h ago',
    type: 'check',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { showPermissions } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [contactsVisible, setContactsVisible] = useState(false);
  const [selectContactsVisible, setSelectContactsVisible] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [trackedContactCodes, setTrackedContactCodes] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [alertStatusMessage, setAlertStatusMessage] = useState<string | null>(null);
  const { user } = useUser();
  const contacts = user.contacts ?? [];
  const { consentGranted, location, error, loading, enableLocationSharing, refreshLocation } = useLocationSharing();

  const quickActions = [
    { label: 'Fire Service', description: 'Call 192', color: '#f7d2cf', onPress: () => {} },
    { label: 'Ambulance', description: 'Call 193', color: '#d8e8f4', onPress: () => {} },
    { label: 'Police', description: 'Call 191', color: '#f6e2db', onPress: () => {} },
    { label: 'Contacts', description: 'Trusted circle', color: '#dbe9db', onPress: () => setContactsVisible(true) },
  ];

  const defaultCenter = { latitude: 37.7749, longitude: -122.4194 };
  const mapCenter = location?.coords ?? defaultCenter;
  const mapRegion = {
    latitude: mapCenter.latitude,
    longitude: mapCenter.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const toggleSelectedContact = (contactId: string) => {
    setSelectedContacts((current) =>
      current.includes(contactId) ? current.filter((id) => id !== contactId) : [...current, contactId]
    );
  };

  const addTrackedContactCodes = (contactCodes: string[]) => {
    setTrackedContactCodes((current) => {
      const nextSet = new Set(current);
      contactCodes.forEach((code) => nextSet.add(code));
      return Array.from(nextSet);
    });
  };

  const handleSendLocationAlert = () => {
    if (selectedContacts.length === 0) {
      setAlertStatusMessage('Select at least one contact to notify.');
      return;
    }

    setNotifications((current) => [
      {
        title: 'Location Alert',
        description: `Your current location was shared with ${selectedContacts.length} ${selectedContacts.length === 1 ? 'contact' : 'contacts'}.`,
        time: 'Now',
        type: 'emergency',
      },
      ...current,
    ]);
    setAlertStatusMessage(`Location shared with ${selectedContacts.length} ${selectedContacts.length === 1 ? 'contact' : 'contacts'}.`);
    addTrackedContactCodes(selectedContacts);
    setSelectedContacts([]);
    setSelectContactsVisible(false);
  };

  const handleSendUrgentAll = () => {
    if (contacts.length === 0) {
      setAlertStatusMessage('Add contacts first to send an urgent alert.');
      return;
    }

    setNotifications((current) => [
      {
        title: 'Urgent',
        description: `Urgent alert sent to all ${contacts.length} trusted contact${contacts.length === 1 ? '' : 's'}.`,
        time: 'Now',
        type: 'emergency',
      },
      ...current,
    ]);
    setAlertStatusMessage(`Urgent alert sent to all ${contacts.length} trusted contacts.`);
    addTrackedContactCodes(contacts.map((contact) => contact.contactCode));
  };

  useEffect(() => {
    if (showPermissions === '1') {
      setModalVisible(true);
    }
  }, [showPermissions]);

  const peopleTracking = contacts.length
    ? contacts
        .filter((contact) => trackedContactCodes.length === 0 || trackedContactCodes.includes(contact.contactCode))
        .map((contact) => ({
          name: contact.name,
          status: contact.sharingEnabled === false ? 'Paused' : contact.status,
          distance: contact.sharingEnabled === false ? 'Paused' : 'Just now',
        }))
    : people;

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <AppLogo size={40} />
              <ThemedText type="subtitle">SafeGuard</ThemedText>
            </View>
            <Pressable style={styles.iconButton} onPress={() => setShowNotifications(true)}>
              <ThemedText type="default">🔔</ThemedText>
            </Pressable>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <ThemedText type="smallBold" style={styles.statusPillText}>
                Location Active
              </ThemedText>
            </View>
          </View>

          <View style={styles.mapCard}>
            <View style={styles.mapContent}>
              <View style={styles.mapBadge}>
                <ThemedText type="default">📍</ThemedText>
              </View>
              <ThemedText type="title" style={styles.mapLabel}>
                Tracking you now
              </ThemedText>
            </View>
            {!consentGranted ? (
              <View style={styles.locationConsentCard}>
                <ThemedText type="smallBold">Enable Location Sharing</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Allow access to display your real-time device location on the home preview.
                </ThemedText>
                <Pressable style={styles.consentButton} onPress={enableLocationSharing}>
                  <ThemedText type="default" style={styles.consentButtonText}>
                    Allow Location Sharing
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.homeMapContainer}>
                <ActualMap latitude={mapCenter.latitude} longitude={mapCenter.longitude} radius={0.1} style={styles.homeMap} />
                {loading && (
                  <View style={styles.mapOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                    <ThemedText type="small" style={styles.mapLoadingText}>
                      Updating location...
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
            {error && (
              <View style={styles.locationErrorCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  {error}
                </ThemedText>
              </View>
            )}
            <View style={styles.alertActionRow}>
              <Pressable style={styles.alertActionButton} onPress={() => setSelectContactsVisible(true)}>
                <ThemedText type="default" style={styles.alertActionText}>
                  Alert
                </ThemedText>
              </Pressable>
              <Pressable style={[styles.alertActionButton, styles.alertAllButton]} onPress={handleSendUrgentAll}>
                <ThemedText type="default" style={styles.alertActionText}>
                  Alert All
                </ThemedText>
              </Pressable>
            </View>
            {alertStatusMessage ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.alertStatusText}>
                {alertStatusMessage}
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">People Tracking You</ThemedText>
            <Link href="/home" asChild>
              <Pressable>
                <ThemedText type="linkPrimary">View All</ThemedText>
              </Pressable>
            </Link>
          </View>
          <Modal animationType="fade" transparent visible={modalVisible}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <ThemedText type="subtitle">Grant Permissions</ThemedText>
                <ThemedText type="small" style={styles.modalSubtitle} themeColor="textSecondary">
                  SafeGuard needs these permissions to keep you safe and connected with your trusted contacts.
                </ThemedText>
                <View style={styles.permissionCard}>
                  <View style={styles.permissionIcon}>
                    <ThemedText type="default">📍</ThemedText>
                  </View>
                  <View style={styles.permissionText}>
                    <ThemedText type="default" style={styles.permissionTitle}>
                      Location Services
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      Required to share your real-time location with trusted contacts and enable emergency tracking features.
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.permissionCard}>
                  <View style={styles.permissionIcon}>
                    <ThemedText type="default">📷</ThemedText>
                  </View>
                  <View style={styles.permissionText}>
                    <ThemedText type="default" style={styles.permissionTitle}>
                      Camera Access
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      Allows you to capture photos during emergencies and share visual information with your safety network.
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.permissionCard}>
                  <View style={styles.permissionIcon}>
                    <ThemedText type="default">🎙️</ThemedText>
                  </View>
                  <View style={styles.permissionText}>
                    <ThemedText type="default" style={styles.permissionTitle}>
                      Microphone Access
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      Enables audio recording of your surroundings when you activate emergency mode for evidence and safety.
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.permissionCard}>
                  <View style={styles.permissionIcon}>
                    <ThemedText type="default">🔔</ThemedText>
                  </View>
                  <View style={styles.permissionText}>
                    <ThemedText type="default" style={styles.permissionTitle}>
                      Notifications
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      Stay informed with alerts from your safety circle and receive immediate notifications during emergencies.
                    </ThemedText>
                  </View>
                </View>
                <Pressable style={styles.allowButton} onPress={() => setModalVisible(false)}>
                  <ThemedText type="default" style={styles.allowButtonText}>
                    Allow Access
                  </ThemedText>
                </Pressable>
                <Pressable style={styles.skipButton} onPress={() => setModalVisible(false)}>
                  <ThemedText type="linkPrimary">Skip for Now</ThemedText>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal animationType="fade" transparent visible={showNotifications}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderRow}>
                  <ThemedText type="subtitle">Notifications</ThemedText>
                  <Pressable onPress={() => setShowNotifications(false)} style={styles.closeButton}>
                    <ThemedText type="default">✕</ThemedText>
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  Recent alerts from your safety network.
                </ThemedText>
                <View style={styles.notificationList}>
                  {notifications.map((notification) => (
                    <View key={notification.title + notification.time} style={styles.notificationCard}>
                      <View style={[styles.notificationBadge, notification.type === 'emergency' && styles.emergencyBadge, notification.type === 'boundary' && styles.boundaryBadge, notification.type === 'check' && styles.checkBadge]}>
                        <ThemedText type="default">{notification.type === 'emergency' ? '!' : notification.type === 'boundary' ? '⚠️' : '✓'}</ThemedText>
                      </View>
                      <View style={styles.notificationContent}>
                        <ThemedText type="default" style={styles.notificationTitle}>
                          {notification.title}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {notification.description}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary" style={styles.notificationTime}>
                          {notification.time}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
          <Modal animationType="fade" transparent visible={selectContactsVisible}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderRow}>
                  <ThemedText type="subtitle">Alert Contacts</ThemedText>
                  <Pressable onPress={() => setSelectContactsVisible(false)} style={styles.closeButton}>
                    <ThemedText type="default">✕</ThemedText>
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  Select the trusted contacts you want to notify with your current location.
                </ThemedText>
                <View style={styles.contactList}>
                  {contacts.length === 0 ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      No contacts added yet.
                    </ThemedText>
                  ) : (
                    contacts.map((contact) => {
                      const selected = selectedContacts.includes(contact.contactCode);
                      return (
                        <Pressable
                          key={contact.contactCode}
                          style={[styles.contactRow, selected && styles.contactRowSelected]}
                          onPress={() => toggleSelectedContact(contact.contactCode)}
                        >
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
                          <ThemedText type="small" themeColor="textSecondary">
                            {selected ? 'Selected' : 'Tap to select'}
                          </ThemedText>
                        </Pressable>
                      );
                    })
                  )}
                </View>
                <Pressable style={styles.allowButton} onPress={handleSendLocationAlert}>
                  <ThemedText type="default" style={styles.allowButtonText}>
                    Send Location Alert
                  </ThemedText>
                </Pressable>
                <Pressable style={styles.skipButton} onPress={() => setSelectContactsVisible(false)}>
                  <ThemedText type="linkPrimary">Cancel</ThemedText>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Modal animationType="fade" transparent visible={contactsVisible}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeaderRow}>
                  <ThemedText type="subtitle">Trusted Contacts</ThemedText>
                  <Pressable onPress={() => setContactsVisible(false)} style={styles.closeButton}>
                    <ThemedText type="default">✕</ThemedText>
                  </Pressable>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  See all contacts you’ve added from your profile page.
                </ThemedText>
                <View style={styles.contactList}>
                  {contacts.length === 0 ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      No trusted contacts added yet.
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
                </View>
                <Pressable style={styles.allowButton} onPress={() => setContactsVisible(false)}>
                  <ThemedText type="default" style={styles.allowButtonText}>
                    Close
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={styles.peopleList}>
            {peopleTracking.map((person) => (
              <View key={`${person.name}-${person.distance}`} style={styles.personCard}>
                <View style={styles.personAvatar}>
                  <ThemedText type="default">{person.name[0]}</ThemedText>
                </View>
                <View style={styles.personDetails}>
                  <ThemedText type="default" style={styles.personName}>
                    {person.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {person.distance}
                  </ThemedText>
                </View>
                <View style={[styles.personStatus, person.status === 'Active' || person.status === 'Tracking' ? styles.statusActive : styles.statusPaused]}>
                  <ThemedText type="smallBold" style={styles.personStatusText}>
                    {person.status}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Emergency Services</ThemedText>
          </View>
          <View style={styles.gridRow}>
            {quickActions.map((action) => (
              <Pressable key={action.label} onPress={action.onPress} style={[styles.quickCard, { backgroundColor: action.color }]}> 
                <ThemedText type="default" style={styles.quickTitle}>
                  {action.label}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {action.description}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Boundary Status</ThemedText>
          </View>
          <View style={styles.statusCard}>
            <View>
              <ThemedText type="default" style={styles.statusCardTitle}>
                Safe Zone Active
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                You are within your designated safe boundary.
              </ThemedText>
            </View>
            <View style={styles.boundaryAction}>
              <ThemedText type="smallBold">Active</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                11:30 PM Tonight
              </ThemedText>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <ThemedText type="linkPrimary">See All</ThemedText>
          </View>
          <View style={styles.activityList}>
            {activities.map((item) => (
              <View key={item.title} style={styles.activityCard}>
                <View style={styles.activityDot} />
                <View>
                  <ThemedText type="default" style={styles.activityTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.time}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statusRow: {
    alignItems: 'flex-start',
  },
  statusPill: {
    backgroundColor: '#e8f6f4',
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  statusPillText: {
    color: '#2f6b5b',
  },
  mapCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    backgroundColor: '#dbe9ff',
    gap: Spacing.four,
  },
  mapContent: {
    gap: Spacing.two,
  },
  mapBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeMapContainer: {
    height: 220,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    backgroundColor: '#e7ecf6',
  },
  homeMap: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  mapLoadingText: {
    color: '#fff',
  },
  locationConsentCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    gap: Spacing.two,
  },
  consentButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
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
    marginTop: Spacing.two,
  },
  consentButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  consentButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  mapLabel: {
    maxWidth: 220,
  },
  alertActionRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  alertActionButton: {
    flex: 1,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  alertAllButton: {
    backgroundColor: '#7f1d1d',
  },
  alertActionText: {
    color: '#fff',
    fontWeight: '700',
  },
  alertStatusText: {
    marginTop: Spacing.two,
  },
  mapActionRow: {
    alignItems: 'flex-start',
  },
  actionButton: {
    marginTop: Spacing.one,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: '#c8554f',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  peopleList: {
    gap: Spacing.two,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#fbe6e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    fontWeight: '700',
  },
  personStatus: {
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  statusActive: {
    backgroundColor: '#e8f6f4',
  },
  statusPaused: {
    backgroundColor: '#f0ebe6',
  },
  personStatusText: {
    color: '#2b2b2b',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  quickTitle: {
    marginBottom: Spacing.one,
    fontWeight: '700',
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statusCardTitle: {
    fontWeight: '700',
  },
  boundaryAction: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  activityList: {
    gap: Spacing.two,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#c8554f',
  },
  activityTitle: {
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  modalSubtitle: {
    maxWidth: 300,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    backgroundColor: '#f8f4ef',
  },
  permissionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    flex: 1,
    gap: Spacing.one,
  },
  permissionTitle: {
    fontWeight: '700',
  },
  allowButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  allowButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f4f7',
  },
  notificationList: {
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  notificationCard: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#f8f7ff',
  },
  notificationBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7e8ff',
  },
  emergencyBadge: {
    backgroundColor: '#ffe6e5',
  },
  boundaryBadge: {
    backgroundColor: '#eef4e7',
  },
  checkBadge: {
    backgroundColor: '#e6f3f9',
  },
  notificationContent: {
    flex: 1,
    gap: Spacing.one,
  },
  notificationTitle: {
    fontWeight: '700',
  },
  notificationTime: {
    color: '#6f7988',
  },
  contactList: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: '#f8f8fb',
  },
  contactRowSelected: {
    backgroundColor: '#e8f6f4',
    borderWidth: 1,
    borderColor: '#c8e8dd',
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e7f4f0',
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
});
