import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ReminderDetailModalProps } from '../../../types';
import { useReminders } from '../../../hooks';


const ReminderDetailModal: React.FC<ReminderDetailModalProps> = ({
  visible,
  reminder,
  onClose,
}) => {
  const { deleteReminder, detectCategory, formatDate } = useReminders();

  if (!reminder) return null;

  const category = detectCategory(reminder.title, reminder.description);

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteReminder(reminder.id);
            onClose();
          }
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Reminder Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={[styles.categoryBadge, { backgroundColor: category.bg }]}>
              <Text style={[styles.categoryText, { color: category.color }]}>
                {category.label}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Title</Text>
              <Text style={styles.title}>{reminder.title}</Text>
            </View>

            {reminder.description && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.description}>{reminder.description}</Text>
              </View>
            )}

            {reminder.reminderDate && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Scheduled For</Text>
                <View style={styles.dateTimeCard}>
                  <Text style={styles.dateTimeText}>
                    {formatDate(reminder.reminderDate)}
                  </Text>
                  <View style={styles.timeIndicator}>
                    <Text style={styles.timeIndicatorText}>
                      {reminder.reminderDate > Date.now() ? 'Upcoming' : 'Past'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {category.label === 'Urgent' && (
              <View style={styles.priorityCard}>
                <View style={styles.priorityContent}>
                  <Text style={styles.priorityTitle}>High Priority</Text>
                  <Text style={styles.priorityText}>
                    This reminder requires immediate attention
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.deleteButtonLarge}
              onPress={handleDelete}
              activeOpacity={0.7}>
              <Text style={styles.deleteButtonLargeText}>Delete Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
    lineHeight: 20,
  },
  scrollView: {
    padding: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 30,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  dateTimeCard: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4338CA',
    marginBottom: 8,
  },
  timeIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  createdDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  priorityCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    gap: 12,
    marginBottom: 16,
  },
  priorityIcon: {
    fontSize: 24,
  },
  priorityContent: {
    flex: 1,
  },
  priorityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 14,
    color: '#B91C1C',
  },
  actionButtons: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  deleteButtonLarge: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'red',
  },
  deleteButtonLargeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'red',
  },
});

export default ReminderDetailModal;
