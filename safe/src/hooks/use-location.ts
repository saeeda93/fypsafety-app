import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

type PermissionStatus = Location.PermissionStatus;

export function useLocationSharing() {
  const [consentGranted, setConsentGranted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        setError('Location permission denied. Please enable it in your device settings.');
        return false;
      }

      setError(null);
      return true;
    } catch (err) {
      setError('Unable to request location permission.');
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    if (!consentGranted) {
      setError('Location sharing is disabled.');
      return;
    }

    setLoading(true);
    try {
      const hasPermission = permissionStatus === Location.PermissionStatus.GRANTED
        ? true
        : await requestPermissions();

      if (!hasPermission) {
        setLocation(null);
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setLocation(currentLocation);
      setError(null);
    } catch (err) {
      setLocation(null);
      setError('Could not obtain current location.');
    } finally {
      setLoading(false);
    }
  }, [consentGranted, permissionStatus, requestPermissions]);

  const enableLocationSharing = useCallback(async () => {
    setConsentGranted(true);
    const granted = await requestPermissions();

    if (granted) {
      await refreshLocation();
    }
  }, [requestPermissions, refreshLocation]);

  useEffect(() => {
    if (consentGranted && permissionStatus === Location.PermissionStatus.GRANTED) {
      refreshLocation();
    }
  }, [consentGranted, permissionStatus, refreshLocation]);

  return {
    consentGranted,
    permissionStatus,
    location,
    error,
    loading,
    enableLocationSharing,
    refreshLocation,
  };
}
