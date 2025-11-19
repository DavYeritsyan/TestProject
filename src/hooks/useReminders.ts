import { useEffect, useState, useMemo } from 'react';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'work' | 'personal' | 'urgent'>('all');

  useEffect(() => {
    const unsubscribe = subscribeToReminders();
    return () => unsubscribe();
  }, [subscribeToReminders]);

  // Filter reminders based on search and category
  const filteredReminders = useMemo(() => {
    let filtered = reminders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => {
        const text = (item.title + ' ' + item.description).toLowerCase();
        switch (selectedFilter) {
          case 'work':
            return text.includes('work') || text.includes('meeting') || text.includes('project');
          case 'personal':
            return text.includes('personal') || text.includes('home') || text.includes('family');
          case 'urgent':
            return text.includes('urgent') || text.includes('asap') || text.includes('important');
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [reminders, searchQuery, selectedFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: reminders.length,
      work: reminders.filter(r => {
        const text = (r.title + ' ' + r.description).toLowerCase();
        return text.includes('work') || text.includes('meeting');
      }).length,
      personal: reminders.filter(r => {
        const text = (r.title + ' ' + r.description).toLowerCase();
        return text.includes('personal') || text.includes('home');
      }).length,
    };
  }, [reminders]);

  return {
    reminders,
    filteredReminders,
    stats,
    loading,
    error,
    addReminder,
    deleteReminder,
    clearError,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
  };
};
