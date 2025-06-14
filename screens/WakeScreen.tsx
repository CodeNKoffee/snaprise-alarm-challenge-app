import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, Vibration } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Timer from '@/components/Timer';
import { getBarcodeData } from '@/utils/barcodeUtils';

interface WakeScreenProps {
  alarmId?: string;
  onDismiss?: () => void;
}

// Using the AlarmData interface from alarmUtils.ts but adding barcode field for backward compatibility
interface AlarmData {
  id: string;
  time: Date;
  challengeType: 'barcode' | 'riddle';
  isActive: boolean;
  days: number[]; // 0-6 representing Sunday-Saturday
  label?: string;
  barcodeData?: string;
  barcode?: string; // For backward compatibility
}

export default function WakeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ alarmId?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [alarmData, setAlarmData] = useState<AlarmData | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [snoozeDisabled, setSnoozeDisabled] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [buddyModeEnabled, setBuddyModeEnabled] = useState(true); // Enable buddy mode by default
  
  // Get current time for display
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  
  useEffect(() => {
    // Load alarm data
    if (params.alarmId) {
      loadAlarmData(params.alarmId);
    }
    
    // Check if buddy mode parameter was passed
    if (params.buddyMode) {
      setBuddyModeEnabled(params.buddyMode === 'true');
    }
    
    // Start alarm sound and vibration
    startAlarm();
    
    // Start sun rise animation
    startAnimation();
    
    // Prevent going back using the useFocusEffect hook
    // Note: We're using a different approach since router.addListener is not available
    // This will be handled by the hardware back button on Android
    // For iOS, we'll rely on the UI not having a back button
    
    return () => {
      // Clean up
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
      Vibration.cancel();
    };
  }, []);
  
  const loadAlarmData = async (alarmId: string) => {
    try {
      // In a real app, you would fetch the alarm data from storage
      // For now, we'll just simulate it with some default data
      const mockAlarmData: AlarmData = {
        id: alarmId,
        label: 'Wake Up',
        challengeType: 'barcode',
        time: new Date(),
        isActive: true,
        days: [1, 2, 3, 4, 5],
      };
      
      // If it's a barcode challenge, get the stored barcode
      if (mockAlarmData.challengeType === 'barcode') {
        const barcode = await getBarcodeData(alarmId);
        if (barcode) {
          mockAlarmData.barcode = barcode;
        }
      }
      
      setAlarmData(mockAlarmData);
    } catch (error) {
      console.error('Failed to load alarm data:', error);
    }
  };
  
  const startAlarm = async () => {
    try {
      // Load and play alarm sound
      const { sound: alarmSound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/alarm.mp3'),
        { isLooping: true, volume: 1.0 }
      );
      setSound(alarmSound);
      await alarmSound.playAsync();
      
      // Start vibration pattern
      const PATTERN = [1000, 2000, 3000];
      Vibration.vibrate(PATTERN, true);
    } catch (error) {
      console.error('Failed to start alarm:', error);
    }
  };
  
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  const handleSnooze = () => {
    if (snoozeCount >= 2) {
      // After 2 snoozes, disable the snooze button
      setSnoozeDisabled(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSnoozeCount(snoozeCount + 1);
    
    // Stop sound and vibration temporarily
    if (sound) {
      sound.stopAsync();
    }
    Vibration.cancel();
    
    // Restart alarm after 5 minutes (in a real app)
    // For demo purposes, we'll restart it after just 5 seconds
    setTimeout(() => {
      if (sound) {
        sound.playAsync();
      }
      const PATTERN = [1000, 2000, 3000];
      Vibration.vibrate(PATTERN, true);
    }, 5000); // 5 seconds for demo (would be 300000 for 5 minutes)
  };
  
  const startChallenge = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setChallengeStarted(true);
    
    // Navigate to the appropriate challenge screen
    if (alarmData && alarmData.challengeType === 'barcode') {
      router.push({
        pathname: '/screens/CameraChallenge',
        params: { 
          alarmId: alarmData.id,
          targetBarcode: alarmData.barcode,
        }
      });
    } else {
      router.push({
        pathname: '/screens/RiddleChallenge',
        params: { alarmId: alarmData?.id }
      });
    }
    
    // Stop alarm sound and vibration
    if (sound) {
      sound.stopAsync();
    }
    Vibration.cancel();
  };
  
  const pulseAnimation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sun Animation */}
      <Animated.View 
        style={[
          styles.sunContainer,
          { 
            transform: [{ scale: pulseAnimation }],
            backgroundColor: colors.accent,
          }
        ]}
      >
        <FontAwesome name="sun-o" size={80} color="white" />
      </Animated.View>
      
      {/* Time and Date */}
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: colors.text }]}>{currentTime}</Text>
        <Text style={[styles.dateText, { color: colors.mediumGray }]}>{currentDate}</Text>
      </View>
      
      {/* Alarm Message */}
      <View style={styles.messageContainer}>
        <Text style={[styles.messageTitle, { color: colors.text }]}>Good Morning!</Text>
        <Text style={[styles.messageSubtitle, { color: colors.mediumGray }]}>
          {alarmData?.label || 'Time to wake up!'}
        </Text>
      </View>
      
      {/* Challenge Button */}
      <TouchableOpacity 
        style={[styles.wakeButton, { backgroundColor: colors.primary }]}
        onPress={startChallenge}
      >
        <Text style={styles.buttonText}>
          {alarmData?.challengeType === 'barcode' ? 'Scan to Wake Up' : 'Solve Riddle to Wake Up'}
        </Text>
      </TouchableOpacity>
      
      {/* Snooze Button */}
      <TouchableOpacity 
        style={[
          styles.snoozeButton, 
          { 
            backgroundColor: snoozeDisabled ? colors.lightGray : colors.secondary,
            opacity: snoozeDisabled ? 0.5 : 1,
          }
        ]}
        onPress={handleSnooze}
        disabled={snoozeDisabled || buddyModeEnabled}
      >
        <Text style={styles.buttonText}>
          {buddyModeEnabled ? 'Buddy Mode Active - No Snooze' : 
           snoozeDisabled ? 'No More Snoozes' : `Snooze (${2 - snoozeCount} left)`}
        </Text>
      </TouchableOpacity>
      
      {/* Buddy Mode Indicator */}
      {buddyModeEnabled && (
        <View style={[styles.buddyModeContainer, { backgroundColor: colors.primary }]}>
          <FontAwesome name="user-plus" size={16} color="white" style={styles.buddyIcon} />
          <Text style={styles.buddyModeText}>Buddy Mode Active - Complete Challenge to Dismiss</Text>
        </View>
      )}
      
      {/* Motivational Message */}
      <Text style={[styles.motivationalText, { color: colors.mediumGray }]}>
        {snoozeCount > 0 ? 
          "You've snoozed enough. Time to rise and shine!" : 
          "Rise and shine! Your day is waiting for you."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sunContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 18,
    marginTop: 5,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  messageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageSubtitle: {
    fontSize: 18,
  },
  wakeButton: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  snoozeButton: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  motivationalText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buddyModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 5,
  },
  buddyIcon: {
    marginRight: 8,
  },
  buddyModeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});