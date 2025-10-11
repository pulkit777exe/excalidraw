import { create } from 'zustand';

export interface AppState {
  isInitialized: boolean;
  currentPage: string;
  lastActivity: Date | null;
}

export interface AppActions {
  setInitialized: (initialized: boolean) => void;
  setCurrentPage: (page: string) => void;
  updateActivity: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  // State
  isInitialized: false,
  currentPage: '/',
  lastActivity: null,

  // Actions
  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized });
  },

  setCurrentPage: (page: string) => {
    set({ currentPage: page });
  },

  updateActivity: () => {
    set({ lastActivity: new Date() });
  },

  reset: () => {
    set({
      isInitialized: false,
      currentPage: '/',
      lastActivity: null,
    });
  },
}));
