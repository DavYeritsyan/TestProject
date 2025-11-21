import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import notifee, { EventType } from '@notifee/react-native';
import { useNotificationStore } from '../stores/notificationStore';


export const useNotificationHandler = (
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>,
  isAuthenticated: boolean
) => {
  const appState = useRef(AppState.currentState);
  const pendingNotification = useRef<string | null>(null);
  const getPendingReminder = useNotificationStore(state => state.getPendingReminder);
  const isProcessed = useNotificationStore(state => state.isProcessed);
  const markAsProcessed = useNotificationStore(state => state.markAsProcessed);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      
      if (initialNotification) {
        const reminderId = initialNotification.notification.data?.reminderId;
        
        if (reminderId && typeof reminderId === 'string') {
          if (isProcessed(reminderId)) {
            return;
          }

          markAsProcessed(reminderId);
          
          setTimeout(() => {
            if (navigationRef.current?.isReady()) {
              navigationRef.current.navigate('Reminders', { reminderId });
            }
          }, 1500);
        }
      }
    };

    checkInitialNotification();
  }, [isAuthenticated, navigationRef, isProcessed, markAsProcessed]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const reminderId = detail.notification?.data?.reminderId;
        
        if (reminderId && typeof reminderId === 'string') {
          if (navigationRef.current?.isReady()) {
            navigationRef.current.navigate('Reminders', { reminderId });
          } else {
            pendingNotification.current = reminderId;
          }
        }
      }
    });

    return unsubscribe;
  }, [isAuthenticated, navigationRef]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const isComingToForeground = 
        appState.current.match(/inactive|background/) && nextAppState === 'active';

      if (isComingToForeground) {
        const backgroundReminderId = getPendingReminder();
        const foregroundReminderId = pendingNotification.current;
        
        const reminderId = backgroundReminderId || foregroundReminderId;
        
        if (reminderId) {
          pendingNotification.current = null;
          
          setTimeout(() => {
            if (navigationRef.current?.isReady()) {
              navigationRef.current.navigate('Reminders', { reminderId });
            }
          }, 300);
        }
      }
      
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isAuthenticated, navigationRef, getPendingReminder]);

  useEffect(() => {
    if (isAuthenticated && navigationRef.current?.isReady() && pendingNotification.current) {
      const reminderId = pendingNotification.current;
      pendingNotification.current = null;
      navigationRef.current.navigate('Reminders', { reminderId });
    }
  }, [isAuthenticated, navigationRef]);
};
