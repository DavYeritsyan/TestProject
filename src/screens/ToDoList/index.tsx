import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TodoListScreen = () => {
  

  return (
    <View style={styles.container}>
      <Text>Todo List</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});

export default TodoListScreen;
