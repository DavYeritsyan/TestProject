import { useEffect } from 'react';
import { useRemindersStore } from '../stores/remindersStore';

export const useReminders = () => {
  const {
    reminders,
    loading,
    error,
    addReminder,
    deleteReminder,
    clearError,
    subscribeToReminders,
  } = useRemindersStore();

  useEffect(() => {
    const unsubscribe = subscribeToReminders();
    return () => unsubscribe();
  }, [subscribeToReminders]);

  return {
    reminders,
    loading,
    error,
    addReminder,
    deleteReminder,
    clearError,
  };
};
