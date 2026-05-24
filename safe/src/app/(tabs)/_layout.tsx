import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';

export default function TabsLayout() {
  const theme = useTheme();
  const { authenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.replace('/login');
    }
  }, [authenticated, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.backgroundElement }],
        tabBarActiveTintColor: '#c8554f',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="tracking" options={{ title: 'Tracking' }} />
      <Tabs.Screen name="recordings" options={{ title: 'Dependants' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 80 : 64,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
