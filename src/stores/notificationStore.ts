import { create } from 'zustand';

interface NotificationState {
  pendingReminderId: string | null;
  processedNotificationIds: Set<string>;
  
  setPendingReminder: (reminderId: string) => void;
  getPendingReminder: () => string | null;
  clearPending: () => void;
  isProcessed: (reminderId: string) => boolean;
  markAsProcessed: (reminderId: string) => void;
  clearProcessedNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  pendingReminderId: null,
  processedNotificationIds: new Set<string>(),

  setPendingReminder: (reminderId: string) => {
    set({ pendingReminderId: reminderId });
  },

  getPendingReminder: () => {
    const { pendingReminderId } = get();
    set({ pendingReminderId: null });
    return pendingReminderId;
  },

  clearPending: () => {
    set({ pendingReminderId: null });
  },

  isProcessed: (reminderId: string) => {
    return get().processedNotificationIds.has(reminderId);
  },

  markAsProcessed: (reminderId: string) => {
    const { processedNotificationIds } = get();
    const newSet = new Set(processedNotificationIds);
    newSet.add(reminderId);
    set({ processedNotificationIds: newSet });
  },

  clearProcessedNotifications: () => {
    set({ processedNotificationIds: new Set<string>() });
  },
}));
