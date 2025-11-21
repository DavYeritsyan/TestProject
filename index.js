/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { useNotificationStore } from './src/stores/notificationStore';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const reminderId = detail.notification?.data?.reminderId;
    
    if (reminderId && typeof reminderId === 'string') {
      useNotificationStore.getState().setPendingReminder(reminderId);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
