import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Interface for alarm data
export interface AlarmData {
  id: string;
  time: Date;
  challengeType: 'barcode' | 'riddle';
  isActive: boolean;
  days: number[]; // 0-6 representing Sunday-Saturday
  label?: string;
  barcodeData?: string;
}

// Dummy request permissions for notifications (for expo build)
export async function requestNotificationPermissions() {
  // Always return true for expo build
  console.log('Notification permissions requested (dummy for expo build)');
  return true;
}

// Dummy schedule alarm function (for expo build)
export async function scheduleAlarm(alarm: AlarmData) {
  console.log('Scheduling alarm (dummy for expo build):', alarm.id);
  
  // Just return the alarm ID without actually scheduling anything
  return alarm.id;
}

// Dummy cancel alarm function (for expo build)
export async function cancelAlarm(alarmId: string) {
  console.log('Cancelling alarm (dummy for expo build):', alarmId);
  return true;
}

// Get scheduled alarms function (for expo build)
export async function getScheduledAlarms() {
  console.log('Getting scheduled alarms (dummy for expo build)');
  
  // Return some mock alarms for testing purposes
  const mockAlarms: AlarmData[] = [
    {
      id: '1',
      time: new Date(),
      challengeType: 'barcode',
      isActive: true,
      days: [1, 2, 3, 4, 5],
      label: 'Morning Alarm',
      barcodeData: 'mock-barcode-1'
    },
    {
      id: '2',
      time: new Date(new Date().setHours(new Date().getHours() + 1)),
      challengeType: 'riddle',
      isActive: false,
      days: [0, 6],
      label: 'Weekend Alarm'
    }
  ];
  
  return mockAlarms;
}

// Trigger haptic feedback when alarm goes off
export function triggerAlarmHaptics() {
  // Trigger a notification haptic
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  
  // Then trigger a heavy impact
  setTimeout(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, 300);
}

// Generate a unique ID for a new alarm
export function generateAlarmId() {
  return Date.now().toString();
}