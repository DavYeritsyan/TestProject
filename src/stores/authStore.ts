import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { getAuthErrorMessage } from '../constants/authErrors';
import { useTodosStore } from './todosStore';
import { useRemindersStore } from './remindersStore';

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  clearError: () => void;
  resetSuccess: () => void;
  
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  loading: false,
  error: null,
  success: false,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  clearError: () => set({ error: null }),
  resetSuccess: () => set({ success: false }),

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      await auth().signInWithEmailAndPassword(email, password);
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  register: async (email: string, password: string) => {
    set({ loading: true, error: null, success: false });
    
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      set({ success: true, loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    
    try {
      useTodosStore.getState().reset();
      useRemindersStore.getState().reset();
      await auth().signOut();
      set({ loading: false, error: null, success: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to logout';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },
}));
