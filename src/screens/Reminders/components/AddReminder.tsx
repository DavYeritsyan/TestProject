import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReminders } from '../../../hooks';
import { NOTIFICATION_TIMING_OPTIONS } from '../../../constants';

const AddReminder = () => {
  const {
    modalVisible,
    setModalVisible,
    title,
    setTitle,
    description,
    setDescription,
    reminderDate,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,
    notifyMinutesBefore,
    setNotifyMinutesBefore,
    loading,
    error,
    clearError,
    handleAddReminder,
    handleCancel,
    handleDateChange,
    handleTimeChange,
    formatDateTime,
    clearDateTime,
  } = useReminders();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCloseKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible && !showDatePicker && !showTimePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}>
        <TouchableWithoutFeedback onPress={handleCloseKeyboard}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Reminder</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                editable={!loading}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                editable={!loading}
                textAlignVertical="top"
              />
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeLabel}>Reminder Time <Text style={styles.requiredStar}>*</Text></Text>
                <View style={styles.dateTimeButtons}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                    disabled={loading}>
                    <Text style={styles.dateTimeButtonText}>
                      {reminderDate ? 'Change Date' : 'Set Date'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                    disabled={loading}>
                    <Text style={styles.dateTimeButtonText}>
                      {reminderDate ? 'Change Time' : 'Set Time'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {reminderDate && (
                  <View style={styles.selectedDateTimeContainer}>
                    <Text style={styles.selectedDateTime}>{formatDateTime(reminderDate)}</Text>
                    <TouchableOpacity onPress={clearDateTime} style={styles.clearButton}>
                      <Text style={styles.clearButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {reminderDate && (
                <View style={styles.notificationTimingContainer}>
                  <Text style={styles.notificationTimingLabel}>Notify me:</Text>
                  <View style={styles.timingOptions}>
                    {NOTIFICATION_TIMING_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.timingOption,
                          notifyMinutesBefore === option.value && styles.timingOptionActive,
                        ]}
                        onPress={() => setNotifyMinutesBefore(option.value)}
                        disabled={loading}>
                        <Text
                          style={[
                            styles.timingOptionText,
                            notifyMinutesBefore === option.value && styles.timingOptionTextActive,
                          ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={loading}
                  activeOpacity={0.7}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, (loading || !title.trim() || !reminderDate) && styles.saveButtonDisabled]}
                  onPress={handleAddReminder}
                  disabled={loading || !title.trim() || !reminderDate}
                  activeOpacity={0.7}>
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

      </Modal>

      {showDatePicker && Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.pickerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.pickerButtonText, styles.pickerDoneButton]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={reminderDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                themeVariant="light"
                textColor="#000000"
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}
      
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={reminderDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && Platform.OS === 'ios' && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}>
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={styles.pickerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Select Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={[styles.pickerButtonText, styles.pickerDoneButton]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={reminderDate || new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                themeVariant="light"
                textColor="#000000"
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}
      
      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={reminderDate || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  cancelButtonText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6366F1',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 10,
  },
  dateTimeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  dateTimeButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedDateTimeContainer: {
    marginTop: 10,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  selectedDateTime: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  pickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  pickerDoneButton: {
    fontWeight: '700',
  },
  picker: {
    width: '100%',
    height: 216,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  notificationTimingContainer: {
    marginTop: 16,
  },
  notificationTimingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  timingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timingOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timingOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  timingOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  timingOptionTextActive: {
    color: '#6366F1',
  },
  requiredStar: {
    color: '#DC2626',
    fontSize: 14,
  },
});

export default AddReminder;
