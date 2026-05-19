import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const dependants = [
  {
    id: 1,
    name: 'Emma Wilson',
    location: 'Downtown Coffee Shop',
    status: 'Online',
    time: '2 min ago',
    avatar: '👩',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Tech Park Office',
    status: 'Online',
    time: '5 min ago',
    avatar: '👨',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    location: 'University Campus',
    status: 'Offline',
    time: '8 min ago',
    avatar: '👩‍🦰',
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    location: 'Fitness Center',
    status: 'Online',
    time: 'Just now',
    avatar: '👨‍🦱',
  },
  {
    id: 5,
    name: 'Linda Davis',
    location: 'Home',
    status: 'Offline',
    time: '1 min ago',
    avatar: '👩‍🦳',
  },
];

export default function DependantsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDependants = dependants.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <ThemedText type="subtitle">People Tracking</ThemedText>
            <Pressable style={styles.addButton}>
              <ThemedText style={styles.addButtonText}>+</ThemedText>
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.trackingInfoCard}>
            <View style={styles.trackingInfo}>
              <ThemedText type="smallBold" style={styles.trackingLabel}>
                Currently tracking
              </ThemedText>
              <ThemedText type="subtitle" style={styles.trackingCount}>
                {filteredDependants.length} people
              </ThemedText>
            </View>
            <ThemedText style={styles.locationIcon}>📍</ThemedText>
          </View>

          <View style={styles.personList}>
            {filteredDependants.map((person) => (
              <Pressable 
                key={person.id} 
                style={styles.personCard}
                onPress={() => router.push(`../track-person?personId=${person.id}`)}
              >
                <View style={styles.personAvatar}>
                  <ThemedText style={styles.avatarText}>{person.avatar}</ThemedText>
                </View>
                <View style={styles.personInfo}>
                  <ThemedText type="default" style={styles.personName}>
                    {person.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.personLocation}>
                    {person.location}
                  </ThemedText>
                  <View style={styles.personStatus}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: person.status === 'Online' ? '#4ade80' : '#9ca3af',
                        },
                      ]}
                    />
                    <ThemedText type="small" themeColor="textSecondary">
                      {person.status} • {person.time}
                    </ThemedText>
                  </View>
                </View>
                <Pressable style={styles.personArrow}>
                  <ThemedText style={styles.arrowText}>›</ThemedText>
                </Pressable>
              </Pressable>
            ))}
          </View>

          <View style={styles.quickActionsContainer}>
            <ThemedText type="smallBold" style={styles.quickActionsTitle}>
              Quick Actions
            </ThemedText>
            <View style={styles.quickActionsGrid}>
              <Pressable style={styles.quickActionButton}>
                <ThemedText style={styles.quickActionIcon}>👥</ThemedText>
                <ThemedText type="small" style={styles.quickActionLabel}>
                  View All
                </ThemedText>
              </Pressable>
              <Pressable style={styles.quickActionButton}>
                <ThemedText style={styles.quickActionIcon}>🚨</ThemedText>
                <ThemedText type="small" style={styles.quickActionLabel}>
                  Alerts
                </ThemedText>
              </Pressable>
            </View>
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    color: '#c8554f',
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    backgroundColor: '#f2f4f7',
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.two,
    fontSize: 14,
    color: '#000',
  },
  trackingInfoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  trackingInfo: {
    gap: Spacing.one,
  },
  trackingLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#666',
  },
  trackingCount: {
    fontSize: 24,
    fontWeight: '700',
  },
  locationIcon: {
    fontSize: 24,
  },
  personList: {
    gap: Spacing.three,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  personAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f2f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  },
  avatarText: {
    fontSize: 24,
  },
  personInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  personName: {
    fontWeight: '600',
  },
  personLocation: {
    fontSize: 13,
  },
  personStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  personArrow: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#c8554f',
  },
  quickActionsContainer: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  quickActionsTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#666',
    paddingHorizontal: Spacing.one,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: Spacing.four,
    backgroundColor: '#fff',
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 28,
  },
  quickActionLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
});
