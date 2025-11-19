import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AddReminder, ReminderItem } from './components';
import { useReminders } from '../../hooks';

const RemindersScreen = () => {
  const { reminders } = useReminders();

  return (
    <View style={styles.container}>
      <AddReminder />
      
      {reminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>No reminders yet</Text>
          <Text style={styles.emptySubtext}>Tap + to create your first reminder</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReminderItem item={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default RemindersScreen;
