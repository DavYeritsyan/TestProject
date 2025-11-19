import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { TodoItemProps } from '../../../types';
import { useTodo } from '../../../hooks';


const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  const { updateTodo, deleteTodo } = useTodo();

  const toggleTodo = async () => {
    await updateTodo(item.id, item.completed);
  };

  const removeTodo = async () => {
    await deleteTodo(item.id);
  };

  return (
    <View style={[styles.todoItem, item.completed && styles.todoItemCompleted]}>
      <TouchableOpacity 
        style={styles.todoContent} 
        onPress={toggleTodo}
        activeOpacity={0.7}>
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
            {item.text}
          </Text>
          {item.completed && (
            <Text style={styles.completedLabel}>Completed</Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={removeTodo}
        activeOpacity={0.7}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
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
  todoItemCompleted: {
    backgroundColor: '#F9FAFB',
    opacity: 0.85,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#6366F1',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    lineHeight: 22,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  completedLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
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

export default TodoItem;
