// Type definitions for the app

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: number;
}

export interface ReminderItem {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: number;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface TodoItemProps {
  item: TodoItem;
}
