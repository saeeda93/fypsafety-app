import MapView, { Circle, Marker } from 'react-native-maps';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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

export default function ActualMap({ latitude, longitude, radius, markers, style }: ActualMapProps) {
  const region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const displayMarkers = markers?.length ? markers : [{ latitude, longitude, title: 'You are here' }];

  return (
    <View style={[styles.mapWrapper, style]}>
      <MapView style={styles.map} region={region} showsUserLocation followsUserLocation>
        <Circle
          center={{ latitude, longitude }}
          radius={radius * 1000}
          strokeColor="rgba(200,85,79,0.6)"
          fillColor="rgba(200,85,79,0.16)"
        />
        {displayMarkers.map((marker, index) => (
          <Marker
            key={`${marker.latitude}-${marker.longitude}-${index}`}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
