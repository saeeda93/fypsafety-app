import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

interface MapMarker {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

interface ActualMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  markers?: MapMarker[];
  style?: object;
}

const getMapUrl = (latitude: number, longitude: number, markers?: MapMarker[]) => {
  const zoom = 15;
  const width = 800;
  const height = 400;
  const markerParams = markers && markers.length
    ? markers.map((marker) => `${marker.latitude},${marker.longitude},red-pushpin`).join('|')
    : `${latitude},${longitude},red-pushpin`;
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${markerParams}`;
};

export default function ActualMap({ latitude, longitude, markers, style }: ActualMapProps) {
  const mapUrl = getMapUrl(latitude, longitude, markers);

  return (
    <View style={[styles.mapWrapper, style]}>
      <ImageBackground source={{ uri: mapUrl }} resizeMode="cover" style={styles.image}>
        <View style={styles.locationDot} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#FF5959',
  },
});
