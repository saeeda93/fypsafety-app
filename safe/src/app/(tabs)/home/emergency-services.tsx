import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const services = [
  {
    title: 'Police',
    subtitle: 'Emergency law enforcement',
    label: '911',
    color: '#eef3ff',
  },
  {
    title: 'Ambulance',
    subtitle: 'Medical emergency services',
    label: '911',
    color: '#fff1f1',
  },
  {
    title: 'Fire Service',
    subtitle: 'Fire and rescue operations',
    label: '911',
    color: '#fff5eb',
  },
];

const resources = [
  { title: 'Nearby Hospitals', icon: '🏥' },
  { title: 'Police Stations', icon: '🚓' },
  { title: 'Helplines', icon: '📞' },
  { title: 'First Aid Guide', icon: '🩹' },
];

export default function EmergencyServicesScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ThemedText type="default">←</ThemedText>
          </Pressable>

          <ThemedText type="subtitle">Emergency Services</ThemedText>
          <ThemedText type="small" style={styles.subtitle} themeColor="textSecondary">
            Quick access to emergency services so you can act fast when it matters most.
          </ThemedText>

          <View style={styles.statusCard}>
            <View>
              <ThemedText type="default" style={styles.statusTitle}>
                Status: Safe
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Last updated 2 mins ago
              </ThemedText>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Quick Access</ThemedText>
          </View>
          <View style={styles.serviceList}>
            {services.map((service) => (
              <View key={service.title} style={[styles.serviceCard, { backgroundColor: service.color }]}>
                <View style={styles.serviceIcon}>{/* icon */}
                  <ThemedText type="default">{service.title === 'Police' ? '🛡️' : service.title === 'Ambulance' ? '🚑' : '🔥'}</ThemedText>
                </View>
                <View style={styles.serviceTextGroup}>
                  <ThemedText type="default" style={styles.serviceTitle}>
                    {service.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {service.subtitle}
                  </ThemedText>
                </View>
                <View style={styles.serviceButtons}>
                  <Pressable style={styles.callButton} onPress={() => {}}>
                    <ThemedText type="default" style={styles.callText}>
                      Call Now
                    </ThemedText>
                  </Pressable>
                  <Pressable style={styles.alertButton} onPress={() => {}}>
                    <ThemedText type="default" style={styles.alertText}>
                      Send Alert
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.alertCard}>
            <ThemedText type="default" style={styles.alertTitle}>
              Emergency Alert
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.alertSubtitle}>
              Send instant alert to all trusted contacts with your current location.
            </ThemedText>
            <Pressable style={styles.sendAlertButton} onPress={() => {}}>
              <ThemedText type="default" style={styles.sendAlertText}>
                Send Alert with Location
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Additional Resources</ThemedText>
          </View>
          <View style={styles.gridRow}>
            {resources.map((resource) => (
              <View key={resource.title} style={styles.resourceCard}>
                <ThemedText type="title" style={styles.resourceIcon}>
                  {resource.icon}
                </ThemedText>
                <ThemedText type="default" style={styles.resourceText}>
                  {resource.title}
                </ThemedText>
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
  backButton: {
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
  subtitle: {
    maxWidth: 300,
  },
  statusCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statusTitle: {
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceList: {
    gap: Spacing.three,
  },
  serviceCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  serviceTextGroup: {
    gap: Spacing.one,
  },
  serviceTitle: {
    fontWeight: '700',
  },
  serviceButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  callButton: {
    flex: 1,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  alertButton: {
    flex: 1,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  callText: {
    color: '#000',
    fontWeight: '700',
  },
  alertText: {
    color: '#fff',
    fontWeight: '700',
  },
  alertCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    backgroundColor: '#f7d1cc',
    gap: Spacing.three,
  },
  alertTitle: {
    fontWeight: '700',
  },
  alertSubtitle: {
    maxWidth: 280,
  },
  sendAlertButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  sendAlertText: {
    color: '#fff',
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  resourceCard: {
    width: '48%',
    borderRadius: Spacing.four,
    padding: Spacing.three,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: Spacing.two,
  },
  resourceIcon: {
    fontSize: 24,
  },
  resourceText: {
    textAlign: 'center',
  },
});
