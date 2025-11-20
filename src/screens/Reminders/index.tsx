import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AddReminder } from './components';
import ReminderItem from './components/ReminderItem';
import { useReminders } from '../../hooks';

const RemindersScreen = () => {
  const {
    reminders,
    filteredReminders,
    stats,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    loading
  } = useReminders();

  return (
    <View style={styles.container}>
      {loading ? (
        <View >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>My Reminders</Text>
              <AddReminder />
            </View>

            {reminders.length > 0 && (
              <View style={styles.statsContainer}>
                <View style={[styles.statCard, styles.statCardTotal]}>
                  <Text style={styles.statNumber}>{stats.total}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={[styles.statCard, styles.statCardWork]}>
                  <Text style={styles.statNumber}>{stats.work}</Text>
                  <Text style={styles.statLabel}>Work</Text>
                </View>
                <View style={[styles.statCard, styles.statCardPersonal]}>
                  <Text style={styles.statNumber}>{stats.personal}</Text>
                  <Text style={styles.statLabel}>Personal</Text>
                </View>
              </View>
            )}

            {reminders.length > 0 && (
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search reminders..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Text style={styles.clearButton}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {reminders.length > 0 && (
              <View style={styles.filtersContainer}>
                {(['all', 'work', 'personal', 'urgent'] as const).map(filter => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedFilter(filter)}>
                    <Text style={[
                      styles.filterChipText,
                      selectedFilter === filter && styles.filterChipTextActive
                    ]}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {filteredReminders.length === 0 && reminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No reminders yet</Text>
              <Text style={styles.emptySubtext}>Create your first reminder to get started!</Text>
              <View style={styles.emptyTips}>
                <Text style={styles.tipText}>💡 Tip: Use keywords like "work", "urgent", or "personal"</Text>
              </View>
            </View>
          ) : filteredReminders.length === 0 ? (

            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No matches found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                  {filteredReminders.length} {filteredReminders.length === 1 ? 'reminder' : 'reminders'}
                </Text>
              </View>
              <FlatList
                data={filteredReminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ReminderItem item={item} />}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  statCardTotal: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  statCardWork: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  statCardPersonal: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  clearButton: {
    fontSize: 18,
    color: '#9CA3AF',
    paddingHorizontal: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  listContainer: {
    padding: 20,
    paddingTop: 8,
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
  emptyTips: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
});

export default RemindersScreen;
