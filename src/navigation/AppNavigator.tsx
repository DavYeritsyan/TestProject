import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodoListScreen from '../screens/ToDoList';
import RemindersScreen from '../screens/Reminders';
import { Text, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const handleLogout = () => {
    console.log('Logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Logout cancelled'),
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('Starting logout...');
            try {
              await auth().signOut();
              console.log('Logout successful');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
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
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginRight: 16 }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Logout
            </Text>
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
          tabBarLabel: 'To-Do List',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>✓</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          title: 'Reminders',
          tabBarLabel: 'Reminders',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🔔</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
