import { create } from 'zustand';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ReminderItem } from '../types';

const REMINDERS_COLLECTION = 'reminders';

const getTimeValue = (createdAt: any): number => {
  if (typeof createdAt === 'number') return createdAt;
  return createdAt?.toMillis?.() || 0;
};

interface RemindersState {
  reminders: ReminderItem[];
  loading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  // Actions
  setReminders: (reminders: ReminderItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  
  // Firestore operations
  addReminder: (title: string, description: string) => Promise<{ success: boolean; error?: string }>;
  deleteReminder: (id: string) => Promise<{ success: boolean; error?: string }>;
  subscribeToReminders: () => () => void;
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],
  loading: false,
  error: null,
  unsubscribe: null,

  setReminders: (reminders) => set({ reminders }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    set({ reminders: [], loading: false, error: null, unsubscribe: null });
  },

  addReminder: async (title: string, description: string) => {
    const user = auth().currentUser;
    if (!user) {
      const error = 'User not authenticated';
      set({ error });
      return { success: false, error };
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      const error = 'Please enter a title';
      set({ error });
      return { success: false, error };
    }

    set({ loading: true, error: null });

    try {
      await firestore().collection(REMINDERS_COLLECTION).add({
        title: trimmedTitle,
        description: description.trim(),
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add reminder';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  deleteReminder: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await firestore().collection(REMINDERS_COLLECTION).doc(id).delete();
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove reminder';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  subscribeToReminders: () => {
    const user = auth().currentUser;
    if (!user) return () => {};

    const unsubscribeFn = firestore()
      .collection(REMINDERS_COLLECTION)
      .where('userId', '==', user.uid)
      .onSnapshot(
        (querySnapshot) => {
          const remindersData = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            } as ReminderItem))
            .sort((a, b) => getTimeValue(b.createdAt) - getTimeValue(a.createdAt));
          
          set({ reminders: remindersData });
        },
        (err) => {
          console.error('Error fetching reminders:', err);
          set({ error: 'Failed to fetch reminders' });
        }
      );

    set({ unsubscribe: unsubscribeFn });
    return unsubscribeFn;
  },
}));
