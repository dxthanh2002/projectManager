import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

/**
 * Custom storage for Zustand persistence using Expo SecureStore.
 * NOTE: For non-sensitive UI state, AsyncStorage is generally preferred for performance.
 * Since we are using SecureStore for currentTeamId (contextual), we keep it here.
 */
const secureStorage = {
    getItem: (name: string) => SecureStore.getItemAsync(name),
    setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
    removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

export type ViewMode = 'all' | 'assigned';

interface AppState {
    currentTeamId: string | null;
    setCurrentTeamId: (id: string | null) => void;
    // Dashboard view preference
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    // Clear status
    reset: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentTeamId: null,
            setCurrentTeamId: (id) => set({ currentTeamId: id }),
            viewMode: 'assigned',
            setViewMode: (mode) => set({ viewMode: mode }),
            reset: () => set({ currentTeamId: null, viewMode: 'assigned' }),
        }),
        {
            name: 'managercheck-app-storage',
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
