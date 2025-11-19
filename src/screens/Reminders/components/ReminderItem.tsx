import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ReminderItem as ReminderItemType } from '../../../types';
import { useReminders } from '../../../hooks';

interface ReminderItemProps {
  item: ReminderItemType;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ item }) => {
  const { deleteReminder, error, clearError } = useReminders();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleDelete = async () => {
    await deleteReminder(item.id);
  };

  return (
    <View style={styles.reminderItem}>
      <View style={styles.reminderContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📌</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          {item.description ? (
            <Text style={styles.reminderDescription}>{item.description}</Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDelete}
        activeOpacity={0.7}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reminderItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reminderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 22,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 28,
    color: '#EF4444',
    fontWeight: '300',
    lineHeight: 28,
  },
});

export default ReminderItem;
