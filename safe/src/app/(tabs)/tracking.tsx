import React, { useState } from 'react';
import { ImageBackground, LayoutChangeEvent, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const locationHistoryData = [
  { id: 1, name: 'Central Park', address: 'New York, NY 10024', type: 'Safe location', icon: '📍', time: '3:45 PM', trackedBy: ['Sarah M', 'Mike K'] },
  { id: 2, name: 'Starbucks Coffee', address: '585 Broadway, New York, NY', type: 'Safe location', icon: '📍', time: '2:20 PM', trackedBy: ['Sarah M'] },
  { id: 3, name: 'Penn Station', address: '4 Pennsylvania Plaza, New York, NY', type: 'Transit location', icon: '📍', time: '1:15 PM', trackedBy: ['Sarah M', 'Mike K', 'Emma L'] },
  { id: 4, name: 'Home', address: 'Brooklyn, NY 10001', type: 'Safe location', icon: '🏠', time: '11:30 AM', trackedBy: ['Mike K'] },
  { id: 5, name: 'Whole Foods Market', address: '242 3rd St, Brooklyn, NY', type: 'Safe location', icon: '📍', time: '10:45 AM', trackedBy: ['Mike K', 'Emma L'] },
  { id: 6, name: 'Grand Central Terminal', address: '89 E 42nd St, New York, NY', type: 'Transit location', icon: '📍', time: '9:20 AM', trackedBy: ['Sarah M'] },
  { id: 7, name: 'Prospect Park', address: 'Brooklyn, NY 11215', type: 'Safe location', icon: '📍', time: '8:15 AM', trackedBy: ['Mike K', 'Emma L', 'James C'] },
  { id: 8, name: 'Bagel Cafe', address: '123 Court St, Brooklyn, NY', type: 'Safe location', icon: '📍', time: '7:30 AM', trackedBy: ['Sarah M', 'Mike K'] },
  { id: 9, name: 'Work Office', address: '500 5th Ave, New York, NY', type: 'Safe location', icon: '📍', time: '6:45 AM', trackedBy: ['Sarah M', 'James C'] },
  { id: 10, name: 'Train Station', address: 'Atlantic Terminal, Brooklyn, NY', type: 'Transit location', icon: '📍', time: '6:00 AM', trackedBy: ['Mike K', 'Emma L'] },
];

export default function TrackingScreen() {
  const minRadius = 1;
  const maxRadius = 50;
  const [radius, setRadius] = useState(minRadius);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showLocationHistory, setShowLocationHistory] = useState(false);
  const [visibleLocations, setVisibleLocations] = useState(5);

  const incrementRadius = () => setRadius((value) => Math.min(maxRadius, Math.round((value + 0.5) * 10) / 10));
  const decrementRadius = () => setRadius((value) => Math.max(minRadius, Math.round((value - 0.5) * 10) / 10));

  const updateRadiusFromSlider = (event: any) => {
    if (!sliderWidth) {
      return;
    }

    const x = Number(event.nativeEvent.locationX ?? event.nativeEvent.pageX);
    if (!Number.isFinite(x)) {
      return;
    }

    const percent = Math.max(0, Math.min(1, x / sliderWidth));
    const newRadius = Math.round((minRadius + percent * (maxRadius - minRadius)) * 10) / 10;
    setRadius(newRadius);
  };

  const filledPosition = Math.min(1, Math.max(0, (radius - minRadius) / (maxRadius - minRadius)));
  const mapRadiusSize = 28 + ((radius - minRadius) / (maxRadius - minRadius)) * 220;
  const mapImageUrl =
    'https://staticmap.openstreetmap.de/staticmap.php?center=40.785091,-73.968285&zoom=15&size=600x400&maptype=mapnik&markers=40.785091,-73.968285,lightblue1';

  return (
    <ThemedView style={styles.scene}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle">Set Boundary</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Define a safe radius around your current location and receive alerts if the boundary is crossed.
          </ThemedText>

          <ImageBackground source={{ uri: mapImageUrl }} style={styles.mapPreview} resizeMode="cover">
            <View
              style={[
                styles.mapRadiusCircle,
                {
                  width: mapRadiusSize,
                  height: mapRadiusSize,
                  borderRadius: mapRadiusSize / 2,
                  transform: [
                    { translateX: -mapRadiusSize / 2 },
                    { translateY: -mapRadiusSize / 2 },
                  ],
                },
              ]}
            />
            <View style={styles.mapCenter}>
              <View style={styles.locationDot} />
            </View>
            <View style={styles.radiusLabel}>
              <ThemedText type="default" style={styles.radiusLabelText}>
                Radius
              </ThemedText>
              <ThemedText type="title" style={styles.radiusValue}>
                {radius.toFixed(1)} km
              </ThemedText>
            </View>
            <View style={styles.mapControls}>
              <Pressable style={styles.controlButton} onPress={incrementRadius}>
                <ThemedText type="default">＋</ThemedText>
              </Pressable>
              <Pressable style={styles.controlButton} onPress={decrementRadius}>
                <ThemedText type="default">－</ThemedText>
              </Pressable>
            </View>
          </ImageBackground>

          <View style={styles.sliderRow}>
            <View
              style={styles.sliderTrack}
              onLayout={(event: LayoutChangeEvent) => setSliderWidth(event.nativeEvent.layout.width)}
              onStartShouldSetResponder={() => true}
              onResponderGrant={(event) => {
                setDragging(true);
                updateRadiusFromSlider(event);
              }}
              onResponderMove={updateRadiusFromSlider}
              onResponderRelease={() => setDragging(false)}
              onResponderTerminate={() => setDragging(false)}
            >
              <View style={[styles.sliderFill, { width: `${filledPosition * 100}%` }]} />
              <View
                style={[
                  styles.sliderKnob,
                  {
                    left: `${filledPosition * 100}%`,
                    top: '50%',
                    transform: [{ translateX: -18 }, { translateY: -18 }],
                    backgroundColor: dragging ? '#c8554f' : '#fff',
                    borderColor: dragging ? '#e06d62' : '#c8554f',
                  },
                ]}
              />
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.sliderLabel}>
              {radius.toFixed(1)} km
            </ThemedText>
          </View>
          <View style={styles.sliderMarks}>
            <ThemedText type="small" themeColor="textSecondary">
              {minRadius} km
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {maxRadius} km
            </ThemedText>
          </View>

          <View style={styles.controlCard}>
            <View style={styles.controlRow}>
              <View>
                <ThemedText type="default" style={styles.controlTitle}>
                  Draw Custom Boundary
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Manually define safe areas.
                </ThemedText>
              </View>
              <Pressable style={styles.actionIcon}>
                <ThemedText type="default">▶</ThemedText>
              </Pressable>
            </View>
          </View>

          <View style={styles.controlCard}>
            <View style={styles.controlRow}>
              <View>
                <ThemedText type="default" style={styles.controlTitle}>
                  Boundary Alerts
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Notify when leaving areas.
                </ThemedText>
              </View>
              <Switch value={alertsEnabled} onValueChange={setAlertsEnabled} thumbColor={alertsEnabled ? '#c8554f' : '#ccc'} />
            </View>
          </View>

          <Pressable style={styles.saveButton} onPress={() => {}}>
            <ThemedText type="default" style={styles.saveButtonText}>
              Save Boundary
            </ThemedText>
          </Pressable>

          <Pressable 
            style={styles.locationHistoryButton} 
            onPress={() => setShowLocationHistory(!showLocationHistory)}
          >
            <View style={styles.locationHistoryHeader}>
              <ThemedText type="default" style={styles.locationHistoryTitle}>
                Location History
              </ThemedText>
              <ThemedText style={styles.locationHistoryChevron}>
                {showLocationHistory ? '▼' : '▶'}
              </ThemedText>
            </View>
          </Pressable>

          {showLocationHistory && (
            <View style={styles.locationHistoryContent}>
              <View style={styles.dateSelector}>
                <Pressable>
                  <ThemedText style={styles.dateArrow}>‹</ThemedText>
                </Pressable>
                <ThemedText type="default" style={styles.dateText}>
                  Today, March 14
                </ThemedText>
                <Pressable>
                  <ThemedText style={styles.dateArrow}>›</ThemedText>
                </Pressable>
              </View>

              <ScrollView style={styles.locationsList} nestedScrollEnabled>
                {locationHistoryData.slice(0, visibleLocations).map((location) => (
                  <View key={location.id} style={styles.locationItem}>
                    <View style={styles.locationIcon}>
                      <ThemedText>{location.icon}</ThemedText>
                    </View>
                    <View style={styles.locationInfo}>
                      <ThemedText type="default" style={styles.locationName}>
                        {location.name}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {location.address}
                      </ThemedText>
                      <View style={styles.locationMeta}>
                        <ThemedText type="small" themeColor="textSecondary">
                          ● {location.type}
                        </ThemedText>
                      </View>
                      <View style={styles.trackedByGroup}>
                        <ThemedText type="small" themeColor="textSecondary">
                          tracked by:
                        </ThemedText>
                        <View style={styles.avatarGroup}>
                          {location.trackedBy.map((person, idx) => (
                            <View key={idx} style={styles.avatar}>
                              <ThemedText style={styles.avatarText}>
                                {person.charAt(0)}
                              </ThemedText>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                      {location.time}
                    </ThemedText>
                  </View>
                ))}
              </ScrollView>

              {visibleLocations < locationHistoryData.length && (
                <Pressable 
                  style={styles.loadEarlierButton}
                  onPress={() => setVisibleLocations(visibleLocations + 5)}
                >
                  <ThemedText style={styles.loadEarlierText}>
                    Load Earlier Locations
                  </ThemedText>
                </Pressable>
              )}
            </View>
          )}
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
  subtitle: {
    maxWidth: 320,
  },
  mapPreview: {
    height: 320,
    borderRadius: Spacing.four,
    backgroundColor: '#e7ecf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCenter: {
    width: 216,
    height: 216,
    borderRadius: 110,
    backgroundColor: '#dde5f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDot: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#c8554f',
  },
  radiusLabel: {
    position: 'absolute',
    left: Spacing.four,
    top: Spacing.four,
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  radiusLabelText: {
    fontWeight: '700',
  },
  radiusValue: {
    marginTop: Spacing.one,
  },
  mapControls: {
    position: 'absolute',
    right: Spacing.four,
    top: Spacing.four,
    gap: Spacing.two,
  },
  controlButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  sliderRow: {
    gap: Spacing.two,
  },
  sliderTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#e8e8ea',
    borderRadius: 999,
    justifyContent: 'center',
  },
  sliderKnob: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#c8554f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  knobHeart: {
    fontSize: 16,
    lineHeight: 18,
  },
  mapRadiusCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: 'rgba(200, 85, 79, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(200, 85, 79, 0.35)',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#c8554f',
  },
  sliderLabel: {
    textAlign: 'right',
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlCard: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlTitle: {
    fontWeight: '700',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#f2f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    borderRadius: Spacing.five,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    backgroundColor: '#c8554f',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  locationHistoryButton: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  locationHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationHistoryTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  locationHistoryChevron: {
    fontSize: 12,
    color: '#c8554f',
  },
  locationHistoryContent: {
    borderRadius: Spacing.four,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f7',
  },
  dateArrow: {
    fontSize: 18,
    paddingHorizontal: Spacing.two,
    color: '#c8554f',
  },
  dateText: {
    fontWeight: '600',
    marginHorizontal: Spacing.three,
  },
  locationsList: {
    maxHeight: 400,
    paddingHorizontal: Spacing.four,
  },
  locationItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f7',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  locationInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  locationName: {
    fontWeight: '600',
  },
  locationMeta: {
    marginTop: Spacing.one,
  },
  trackedByGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#c8554f',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  loadEarlierButton: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9ede7',
    borderTopWidth: 1,
    borderTopColor: '#f2f4f7',
  },
  loadEarlierText: {
    color: '#c8554f',
    fontWeight: '600',
  },
});
