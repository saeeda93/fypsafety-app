import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export type SavedBoundary = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  createdAt: string;
  alertsEnabled: boolean;
};

const STORAGE_KEY = 'SAFE_BOUNDARIES';

const BoundaryContext = createContext<{
  boundaries: SavedBoundary[];
  addBoundary: (boundary: Omit<SavedBoundary, 'id' | 'createdAt'>) => Promise<void>;
  removeBoundary: (id: string) => Promise<void>;
  updateBoundary: (id: string, updates: Partial<SavedBoundary>) => Promise<void>;
  loading: boolean;
}>({
  boundaries: [],
  addBoundary: async () => {},
  removeBoundary: async () => {},
  updateBoundary: async () => {},
  loading: false,
});

export function BoundaryProvider({ children }: { children: React.ReactNode }) {
  const [boundaries, setBoundaries] = useState<SavedBoundary[]>([]);
  const [loading, setLoading] = useState(true);

  // Load boundaries on mount
  useEffect(() => {
    const loadBoundaries = async () => {
      try {
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored) {
          setBoundaries(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading boundaries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBoundaries();
  }, []);

  const addBoundary = useCallback(
    async (boundary: Omit<SavedBoundary, 'id' | 'createdAt'>) => {
      try {
        const newBoundary: SavedBoundary = {
          ...boundary,
          id: `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        const updated = [...boundaries, newBoundary];
        setBoundaries(updated);
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error adding boundary:', error);
        throw error;
      }
    },
    [boundaries]
  );

  const removeBoundary = useCallback(
    async (id: string) => {
      try {
        const updated = boundaries.filter((b) => b.id !== id);
        setBoundaries(updated);
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error removing boundary:', error);
        throw error;
      }
    },
    [boundaries]
  );

  const updateBoundary = useCallback(
    async (id: string, updates: Partial<SavedBoundary>) => {
      try {
        const updated = boundaries.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        );
        setBoundaries(updated);
        await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error updating boundary:', error);
        throw error;
      }
    },
    [boundaries]
  );

  const value = useMemo(
    () => ({
      boundaries,
      addBoundary,
      removeBoundary,
      updateBoundary,
      loading,
    }),
    [boundaries, addBoundary, removeBoundary, updateBoundary, loading]
  );

  return (
    <BoundaryContext.Provider value={value}>
      {children}
    </BoundaryContext.Provider>
  );
}

export function useBoundaries() {
  const context = useContext(BoundaryContext);
  if (!context) {
    throw new Error('useBoundaries must be used within BoundaryProvider');
  }
  return context;
}
