import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const personDataMap: Record<number, any> = {
  1: {
    id: 1,
    name: 'Emma Wilson',
    avatar: '👩',
    status: 'Active Now',
    lastUpdate: 'Updated 2 minutes ago',
    boundaryStatus: 'Within Safe Boundary',
    boundaryDetail: 'Downtown District - 0.3 miles radius',
    currentLocation: 'Market Street, San Francisco',
    speed: '0 mph',
    battery: '78%',
  },
  2: {
    id: 2,
    name: 'Michael Chen',
    avatar: '👨',
    status: 'Active Now',
    lastUpdate: 'Updated 5 minutes ago',
    boundaryStatus: 'Within Safe Boundary',
    boundaryDetail: 'Tech Park - 0.5 miles radius',
    currentLocation: 'Silicon Valley, CA',
    speed: '12 mph',
    battery: '85%',
  },
  3: {
    id: 3,
    name: 'Sarah Johnson',
    avatar: '👩‍🦰',
    status: 'Last seen',
    lastUpdate: 'Updated 8 minutes ago',
    boundaryStatus: 'Outside Safe Boundary',
    boundaryDetail: 'University Area - 1.2 miles away',
    currentLocation: 'University Campus, CA',
    speed: '0 mph',
    battery: '42%',
  },
  4: {
    id: 4,
    name: 'Alex Rodriguez',
    avatar: '👨‍🦱',
    status: 'Active Now',
    lastUpdate: 'Updated just now',
    boundaryStatus: 'Within Safe Boundary',
    boundaryDetail: 'Fitness Center - 0.2 miles radius',
    currentLocation: 'Fitness Center, Downtown',
    speed: '2 mph',
    battery: '92%',
  },
  5: {
    id: 5,
    name: 'Linda Davis',
    avatar: '👩‍🦳',
    status: 'Last seen',
    lastUpdate: 'Updated 1 minute ago',
    boundaryStatus: 'Within Safe Boundary',
    boundaryDetail: 'Home Zone - 0.1 miles radius',
    currentLocation: 'Home, Brooklyn NY',
    speed: '0 mph',
    battery: '65%',
  },
};

export default function TrackPersonScreen() {
  const router = useRouter();
  const { personId } = useLocalSearchParams();
  const [alertSent, setAlertSent] = useState(false);

  const id = typeof personId === 'string' ? parseInt(personId) : 1;
  const person = personDataMap[id];

  if (!person) {
    return (
      <ThemedView style={styles.scene}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText>Person not found</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const isBoundaryViolation = person.boundaryStatus === 'Outside Safe Boundary';

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backText}>‹</ThemedText>
          </Pressable>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            {person.name}
          </ThemedText>
          <Pressable style={styles.moreButton}>
            <ThemedText style={styles.moreText}>⋯</ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statusCard}>
            <View style={styles.statusAvatar}>
              <ThemedText style={styles.avatarEmoji}>{person.avatar}</ThemedText>
            </View>
            <View style={styles.statusInfo}>
              <ThemedText type="smallBold" style={styles.statusLabel}>
                ● {person.status}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {person.lastUpdate}
              </ThemedText>
            </View>
          </View>

          <View style={styles.mapPlaceholder}>
            <View style={styles.mapCenter}>
              <ThemedText style={styles.mapCenterDot}>📍</ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.boundaryCard,
              isBoundaryViolation && styles.boundaryCardWarning,
            ]}
          >
            <View style={styles.boundaryIconContainer}>
              <ThemedText style={styles.boundaryIcon}>
                {isBoundaryViolation ? '⚠' : '✓'}
              </ThemedText>
            </View>
            <View style={styles.boundaryInfo}>
              <ThemedText type="smallBold" style={styles.boundaryTitle}>
                {person.boundaryStatus}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {person.boundaryDetail}
              </ThemedText>
            </View>
            <Pressable style={styles.boundaryAction}>
              <ThemedText type="small" style={styles.boundaryActionText}>
                Safe
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.locationCard}>
            <ThemedText style={styles.locationIcon}>📍</ThemedText>
            <View style={styles.locationInfo}>
              <ThemedText type="smallBold">Current Location</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {person.currentLocation}
              </ThemedText>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statIcon}>⚡</ThemedText>
              <ThemedText type="smallBold" style={styles.statLabel}>
                Speed
              </ThemedText>
              <ThemedText type="default" style={styles.statValue}>
                {person.speed}
              </ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statIcon}>🔋</ThemedText>
              <ThemedText type="smallBold" style={styles.statLabel}>
                Battery
              </ThemedText>
              <ThemedText type="default" style={styles.statValue}>
                {person.battery}
              </ThemedText>
            </View>
          </View>

          <Pressable
            style={[styles.sendAlertButton, alertSent && styles.sendAlertButtonSuccess]}
            onPress={() => {
              setAlertSent(true);
              setTimeout(() => setAlertSent(false), 2000);
            }}
          >
            <ThemedText style={styles.sendAlertIcon}>
              {alertSent ? '✓' : '⚠'}
            </ThemedText>
            <ThemedText type="default" style={styles.sendAlertText}>
              {alertSent ? 'Alert Sent' : 'Send Alert'}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f7',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#c8554f',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  moreButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statusAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dde5f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  statusInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  statusLabel: {
    fontSize: 14,
    color: '#4ade80',
  },
  mapPlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: '#e7ecf6',
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapCenter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(200, 85, 79, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(200, 85, 79, 0.2)',
  },
  mapCenterDot: {
    fontSize: 48,
  },
  boundaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  boundaryCardWarning: {
    backgroundColor: '#fef3f2',
    borderLeftWidth: 4,
    borderLeftColor: '#c8554f',
  },
  boundaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boundaryIcon: {
    fontSize: 20,
  },
  boundaryInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  boundaryTitle: {
    fontSize: 14,
  },
  boundaryAction: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: '#f2f4f7',
  },
  boundaryActionText: {
    color: '#666',
    fontWeight: '600',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  locationIcon: {
    fontSize: 24,
  },
  locationInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontWeight: '700',
  },
  sendAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.five,
    backgroundColor: '#c8554f',
  },
  sendAlertButtonSuccess: {
    backgroundColor: '#4ade80',
  },
  sendAlertIcon: {
    fontSize: 20,
    color: '#fff',
  },
  sendAlertText: {
    color: '#fff',
    fontWeight: '700',
  },
});
