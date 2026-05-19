import { Slot } from 'expo-router';
import React from 'react';

import { ThemeProvider } from '@/hooks/use-theme';

// Root layout with theme provider
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
