import { useEffect, useState, useMemo } from 'react';
import { Platform } from 'react-native';
import { useRemindersStore } from '../stores/remindersStore';
import { CATEGORIES, DEFAULT_CATEGORY } from '../constants';

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
  
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notifyMinutesBefore, setNotifyMinutesBefore] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = subscribeToReminders();
    return () => unsubscribe();
  }, [subscribeToReminders]);

  const filteredReminders = useMemo(() => {
    let filtered = reminders;

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  const detectCategory = (title: string, description: string) => {
    const text = (title + ' ' + description).toLowerCase();
    const category = CATEGORIES.find(cat => 
      cat.keywords.some(keyword => text.includes(keyword))
    );
    return category || DEFAULT_CATEGORY;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleAddReminder = async () => {
    let notificationDate = reminderDate;
    
    if (reminderDate && notifyMinutesBefore > 0) {
      notificationDate = new Date(reminderDate.getTime() - (notifyMinutesBefore * 60 * 1000));
    }
    
    const result = await addReminder(title, description, notificationDate);
    if (result.success) {
      setTitle('');
      setDescription('');
      setReminderDate(undefined);
      setNotifyMinutesBefore(0);
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTitle('');
    setDescription('');
    setReminderDate(undefined);
    setNotifyMinutesBefore(0);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      
      if (event.type === 'dismissed') {
        return;
      }
      
      if (selectedDate) {
        if (reminderDate) {
          selectedDate.setHours(reminderDate.getHours());
          selectedDate.setMinutes(reminderDate.getMinutes());
        }
        setReminderDate(selectedDate);
        setShowTimePicker(true);
      }
    } else {
      if (selectedDate) {
        if (reminderDate) {
          selectedDate.setHours(reminderDate.getHours());
          selectedDate.setMinutes(reminderDate.getMinutes());
        }
        setReminderDate(selectedDate);
      }
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      
      if (event.type === 'dismissed') {
        return;
      }
      
      if (selectedTime && reminderDate) {
        const newDate = new Date(reminderDate);
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        setReminderDate(newDate);
      } else if (selectedTime) {
        setReminderDate(selectedTime);
      }
    } else {
      if (selectedTime && reminderDate) {
        const newDate = new Date(reminderDate);
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        setReminderDate(newDate);
      } else if (selectedTime) {
        setReminderDate(selectedTime);
      }
    }
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return 'Set Date & Time';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const clearDateTime = () => {
    setReminderDate(undefined);
    setNotifyMinutesBefore(0);
  };

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
    detectCategory,
    formatDate,
    modalVisible,
    setModalVisible,
    title,
    setTitle,
    description,
    setDescription,
    reminderDate,
    setReminderDate,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,
    notifyMinutesBefore,
    setNotifyMinutesBefore,
    handleAddReminder,
    handleCancel,
    handleDateChange,
    handleTimeChange,
    formatDateTime,
    clearDateTime,
  };
};
