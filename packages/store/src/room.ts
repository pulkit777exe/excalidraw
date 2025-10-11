import { create } from 'zustand';

export interface Room {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  adminId: string;
}

export interface Message {
  id: string;
  message: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Collaborator {
  id: string;
  name: string;
  status: 'online' | 'offline';
  cursor?: {
    x: number;
    y: number;
  };
}

export interface RoomState {
  currentRoom: Room | null;
  messages: Message[];
  collaborators: Collaborator[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RoomActions {
  setCurrentRoom: (room: Room | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (collaboratorId: string) => void;
  updateCollaboratorStatus: (collaboratorId: string, status: 'online' | 'offline') => void;
  updateCollaboratorCursor: (collaboratorId: string, cursor: { x: number; y: number }) => void;
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState & RoomActions>((set, get) => ({
  // State
  currentRoom: null,
  messages: [],
  collaborators: [],
  isConnected: false,
  isLoading: false,
  error: null,

  // Actions
  setCurrentRoom: (room: Room | null) => {
    set({ currentRoom: room });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setMessages: (messages: Message[]) => {
    set({ messages });
  },

  addCollaborator: (collaborator: Collaborator) => {
    set((state) => {
      const exists = state.collaborators.find(c => c.id === collaborator.id);
      if (exists) {
        return state;
      }
      return {
        collaborators: [...state.collaborators, collaborator],
      };
    });
  },

  removeCollaborator: (collaboratorId: string) => {
    set((state) => ({
      collaborators: state.collaborators.filter(c => c.id !== collaboratorId),
    }));
  },

  updateCollaboratorStatus: (collaboratorId: string, status: 'online' | 'offline') => {
    set((state) => ({
      collaborators: state.collaborators.map(c =>
        c.id === collaboratorId ? { ...c, status } : c
      ),
    }));
  },

  updateCollaboratorCursor: (collaboratorId: string, cursor: { x: number; y: number }) => {
    set((state) => ({
      collaborators: state.collaborators.map(c =>
        c.id === collaboratorId ? { ...c, cursor } : c
      ),
    }));
  },

  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      currentRoom: null,
      messages: [],
      collaborators: [],
      isConnected: false,
      isLoading: false,
      error: null,
    });
  },
}));
