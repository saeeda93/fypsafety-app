import { Slot } from 'expo-router';
import React from 'react';

import { ThemeProvider } from '@/hooks/use-theme';
import { UserProvider } from '@/hooks/use-user';
import { BoundaryProvider } from '@/hooks/use-boundaries';

// Root layout with theme and user providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BoundaryProvider>
          <Slot />
        </BoundaryProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
