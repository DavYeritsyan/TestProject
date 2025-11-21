import { create } from 'zustand';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TodoItem } from '../types';

const TODOS_COLLECTION = 'todos';

const getTimeValue = (createdAt: any): number => {
  if (typeof createdAt === 'number') return createdAt;
  return createdAt?.toMillis?.() || 0;
};

interface TodosState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  setTodos: (todos: TodoItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  
  addTodo: (text: string) => Promise<{ success: boolean; error?: string }>;
  updateTodo: (id: string, completed: boolean) => Promise<{ success: boolean; error?: string }>;
  deleteTodo: (id: string) => Promise<{ success: boolean; error?: string }>;
  subscribeToTodos: () => () => void;
}

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,
  unsubscribe: null,

  setTodos: (todos) => set({ todos }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
    }
    set({ todos: [], loading: false, error: null, unsubscribe: null });
  },

  addTodo: async (text: string) => {
    const user = auth().currentUser;
    if (!user) {
      const error = 'User not authenticated';
      set({ error });
      return { success: false, error };
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      const error = 'Please enter a to-do item';
      set({ error });
      return { success: false, error };
    }

    set({ loading: true, error: null });

    try {
      await firestore().collection(TODOS_COLLECTION).add({
        text: trimmedText,
        completed: false,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add to-do item';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  updateTodo: async (id: string, completed: boolean) => {
    set({ loading: true, error: null });

    try {
      await firestore().collection(TODOS_COLLECTION).doc(id).update({
        completed: !completed,
      });
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update to-do item';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  deleteTodo: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await firestore().collection(TODOS_COLLECTION).doc(id).delete();
      set({ loading: false });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove to-do item';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  subscribeToTodos: () => {
    const user = auth().currentUser;
    if (!user) return () => {};

    const unsubscribeFn = firestore()
      .collection(TODOS_COLLECTION)
      .where('userId', '==', user.uid)
      .onSnapshot(
        (querySnapshot) => {
          const todosData = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            } as TodoItem))
            .sort((a, b) => getTimeValue(b.createdAt) - getTimeValue(a.createdAt));
          
          set({ todos: todosData });
        },
        (err) => {
          set({ error: 'Failed to fetch todos' });
        }
      );

    set({ unsubscribe: unsubscribeFn });
    return unsubscribeFn;
  },
}));
