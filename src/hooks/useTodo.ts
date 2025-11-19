import { useEffect } from 'react';
import { useTodosStore } from '../stores/todosStore';

export const useTodo = () => {
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    clearError,
    subscribeToTodos,
  } = useTodosStore();

  useEffect(() => {
    const unsubscribe = subscribeToTodos();
    return () => unsubscribe();
  }, [subscribeToTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    clearError,
  };
};
