import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, useColorScheme, ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigation from './src/navigation/AuthNavigation';
import notificationService from './src/services/notificationService';
import notifee from '@notifee/react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    notificationService.initialize();
  }, []);

  useEffect(() => {
    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      
      if (initialNotification && user) {
        const reminderId = initialNotification.notification.data?.reminderId;
        
        if (reminderId && typeof reminderId === 'string') {
          const timer = setTimeout(() => {
            if (navigationRef.current?.isReady()) {
              navigationRef.current.navigate('Reminders', { reminderId });
            }
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    };

    if (!initializing && user) {
      checkInitialNotification();
    }
  }, [initializing, user]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }


  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={navigationRef}>
        {user ? <AppNavigator /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;
