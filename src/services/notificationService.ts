import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

class NotificationService {
  private channelId = 'reminders-channel';

  async initialize() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: this.channelId,
        name: 'Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } else if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      return settings.authorizationStatus >= 1;
    }
    return false;
  }

  async scheduleNotification(
    id: string,
    title: string,
    body: string,
    timestamp: number
  ): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permission denied');
        return;
      }

      if (timestamp <= Date.now()) {
        console.warn('Cannot schedule notification in the past');
        return;
      }

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
      };
      await notifee.createTriggerNotification(
        {
          id,
          title,
          body,
          data: {
            reminderId: id,
            screen: 'Reminders',
          },
          android: {
            channelId: this.channelId,
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
            sound: 'default',
          },
          ios: {
            sound: 'default',
            foregroundPresentationOptions: {
              alert: true,
              badge: true,
              sound: true,
            },
          },
        },
        trigger
      );

      console.log('Notification scheduled successfully for:', new Date(timestamp));
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async cancelNotification(id: string): Promise<void> {
    try {
      await notifee.cancelNotification(id);
      console.log('Notification cancelled:', id);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async getTriggerNotifications() {
    try {
      const notifications = await notifee.getTriggerNotifications();
      return notifications;
    } catch (error) {
      console.error('Error getting trigger notifications:', error);
      return [];
    }
  }
}

export default new NotificationService();
