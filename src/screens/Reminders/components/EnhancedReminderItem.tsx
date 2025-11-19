import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ReminderItem as ReminderItemType } from '../../../types';
import { useReminders } from '../../../hooks';

interface ReminderItemProps {
  item: ReminderItemType;
}

// Category detection based on keywords
const detectCategory = (title: string, description: string): { icon: string; color: string; bg: string; label: string } => {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('urgent') || text.includes('asap') || text.includes('important') || text.includes('emergency')) {
    return { icon: '🔥', color: '#EF4444', bg: '#FEE2E2', label: 'Urgent' };
  }
  if (text.includes('work') || text.includes('meeting') || text.includes('project') || text.includes('office')) {
    return { icon: '💼', color: '#F59E0B', bg: '#FEF3C7', label: 'Work' };
  }
  if (text.includes('personal') || text.includes('home') || text.includes('family')) {
    return { icon: '🏠', color: '#10B981', bg: '#D1FAE5', label: 'Personal' };
  }
  if (text.includes('health') || text.includes('doctor') || text.includes('medicine')) {
    return { icon: '🏥', color: '#EC4899', bg: '#FCE7F3', label: 'Health' };
  }
  if (text.includes('shopping') || text.includes('buy') || text.includes('purchase')) {
    return { icon: '🛒', color: '#8B5CF6', bg: '#EDE9FE', label: 'Shopping' };
  }
  if (text.includes('travel') || text.includes('trip') || text.includes('vacation')) {
    return { icon: '✈️', color: '#06B6D4', bg: '#CFFAFE', label: 'Travel' };
  }
  if (text.includes('study') || text.includes('learn') || text.includes('course')) {
    return { icon: '📚', color: '#3B82F6', bg: '#DBEAFE', label: 'Study' };
  }
  
  return { icon: '📌', color: '#6366F1', bg: '#EEF2FF', label: 'General' };
};

const EnhancedReminderItem: React.FC<ReminderItemProps> = ({ item }) => {
  const { deleteReminder, error, clearError } = useReminders();
  const category = detectCategory(item.title, item.description);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => await deleteReminder(item.id)
        },
      ]
    );
  };

  return (
    <View style={[styles.reminderItem, { borderLeftColor: category.color }]}>
      <View style={styles.topRow}>
        <View style={[styles.categoryBadge, { backgroundColor: category.bg }]}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={[styles.categoryText, { color: category.color }]}>
            {category.label}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.reminderDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.priorityIndicator}>
          {category.label === 'Urgent' && (
            <>
              <View style={[styles.dot, styles.dotUrgent]} />
              <Text style={styles.priorityText}>High Priority</Text>
            </>
          )}
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
          activeOpacity={0.7}>
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reminderItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 24,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotUrgent: {
    backgroundColor: '#EF4444',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#EF4444',
    fontWeight: '400',
    lineHeight: 24,
  },
});

export default EnhancedReminderItem;
