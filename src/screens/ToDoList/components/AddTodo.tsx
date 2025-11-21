import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTodo } from '../../../hooks';

const AddTodo = () => {
  const [newTodo, setNewTodo] = useState('');
  const { addTodo: addTodoHandler, loading, error, clearError } = useTodo();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
          onPress: () => clearError(),
        },
      ]);
    }
  }, [error, clearError]);

  const handleAddTodo = async () => {
    const result = await addTodoHandler(newTodo);
    if (result.success) {
      setNewTodo('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#9CA3AF"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          editable={!loading}
          returnKeyType="done"
        />
      </View>
      <TouchableOpacity
        style={[styles.addButton, loading && styles.addButtonDisabled]}
        onPress={handleAddTodo}
        disabled={loading}
        activeOpacity={0.8}>
        <Text style={styles.addButtonText}>{loading ? '...' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default AddTodo;
