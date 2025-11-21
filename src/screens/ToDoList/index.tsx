import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { AddTodo, TodoItem } from './components';
import { useTodo } from '../../hooks';

const TodoListScreen = () => {
  const { todos, loading } = useTodo();

  return (
    <View style={styles.container}>
      <AddTodo />
      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet</Text>
          <Text style={styles.emptySubtext}>Create your first task to get started</Text>
        </View>
      ) : (
        <>
          {loading ? (
            <View >
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TodoItem item={item} />}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
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
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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

export default TodoListScreen;
