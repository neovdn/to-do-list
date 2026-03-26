import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are displayed when app is in foreground.
// Wrapped in try/catch because expo-notifications is not fully supported
// in Expo Go for SDK 53+ (remote notifications removed).
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  console.warn('expo-notifications: Could not set notification handler:', error);
}

/**
 * Request notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices.');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'TugasKu Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#7C5CFC',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('expo-notifications: Permission request failed:', error);
    return false;
  }
}

/**
 * Schedule a local notification for a task deadline.
 * Returns the notification identifier (used for cancellation).
 * Gracefully returns null if notifications aren't available (e.g. Expo Go).
 */
export async function scheduleTaskReminder(
  taskTitle: string,
  deadline: Date
): Promise<string | null> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    const now = new Date();
    const triggerDate = new Date(deadline);

    // If deadline is in the past, don't schedule
    if (triggerDate <= now) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Pengingat Tugas!',
        body: `Tugas "${taskTitle}" sudah mendekati tenggat waktu. Yuk segera dikerjakan! 💪`,
        sound: true,
        data: { taskTitle },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
    return id;
  } catch (error) {
    console.warn('expo-notifications: Could not schedule reminder:', error);
    return null;
  }
}

/**
 * Cancel a previously scheduled notification by its identifier.
 */
export async function cancelTaskReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('expo-notifications: Could not cancel reminder:', error);
  }
}
