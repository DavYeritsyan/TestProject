import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoListScreen from '../screens/ToDoList';
import RemindersScreen from '../screens/Reminders';
import { Text, TouchableOpacity, Alert, View, StyleSheet } from 'react-native';
import { TaskIcon } from '../asstets/icons/TaskIcon';
import { ReminderIcon } from '../asstets/icons/ReminderIcon';
import { useAuthStore } from '../stores/authStore';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      '👋 Logout',
      'Are you sure you want to log out?\nYou can always come back anytime!',
      [
        {
          text: 'Stay',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert(
                '⚠️ Oops!',
                'Something went wrong while logging out.\nPlease check your connection and try again.',
                [{ text: 'Got it', style: 'default' }]
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="TodoList"
        component={TodoListScreen}
        options={{
          title: 'To-Do List',
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color }) => <TaskIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          title: 'Reminders',
          tabBarLabel: 'Reminders',
          tabBarIcon: ({ color }) => <ReminderIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppNavigator;
