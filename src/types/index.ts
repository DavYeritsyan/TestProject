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
  reminderDate?: number;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface TodoItemProps {
  item: TodoItem;
}

export interface ReminderDetailModalProps {
  visible: boolean;
  reminder: ReminderItem | null;
  onClose: () => void;
}
export interface ReminderItemProps {
  item: ReminderItem;
  onPress: (item: ReminderItem) => void;
}