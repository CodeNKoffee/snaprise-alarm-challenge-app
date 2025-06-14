import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
// Camera functionality commented out for expo build
// import { Camera } from 'expo-camera';
// import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import * as Haptics from 'expo-haptics';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import PermissionModal from '@/components/PermissionModal';
import { scheduleAlarm, cancelAlarm } from '@/utils/alarmUtils';
import { storeBarcode, getBarcodeData } from '@/utils/barcodeUtils';

interface AlarmData {
  id: string;
  time: Date;
  days: number[];
  label: string;
  isActive: boolean;
  challengeType: 'barcode' | 'riddle';
  barcode?: string;
  barcodeLabel?: string;
  riddleDifficulty?: 'easy' | 'medium' | 'hard';
}

export default function SetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ alarmId?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // State for alarm configuration
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [alarmLabel, setAlarmLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<'barcode' | 'riddle'>('barcode');
  const [riddleDifficulty, setRiddleDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // State for barcode scanning
  const [scanMode, setScanMode] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [barcodeLabel, setBarcodeLabel] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Check if we're editing an existing alarm
  const isEditing = !!params.alarmId;
  
  useEffect(() => {
    if (isEditing) {
      loadAlarmData();
    }
  }, [params.alarmId]);
  
  const loadAlarmData = async () => {
    try {
      // In a real app, you would fetch the alarm data from storage
      // For now, we'll just simulate it
      const alarmData: AlarmData = {
        id: params.alarmId || '',
        time: new Date(),
        days: [1, 2, 3, 4, 5],
        label: 'Work Alarm',
        isActive: true,
        challengeType: 'barcode',
        barcode: '',
        barcodeLabel: '',
      };
      
      setAlarmTime(alarmData.time);
      setAlarmLabel(alarmData.label);
      setSelectedDays(alarmData.days);
      setChallengeType(alarmData.challengeType);
      
      if (alarmData.challengeType === 'barcode' && alarmData.barcode) {
        setScannedBarcode(alarmData.barcode);
        setBarcodeLabel(alarmData.barcodeLabel || '');
      } else if (alarmData.challengeType === 'riddle' && alarmData.riddleDifficulty) {
        setRiddleDifficulty(alarmData.riddleDifficulty);
      }
    } catch (error) {
      console.error('Failed to load alarm data:', error);
      Alert.alert('Error', 'Failed to load alarm data');
    }
  };
  
  // Dummy camera permission check for expo build
  const checkCameraPermission = async () => {
    // Always set permission to true for expo build
    setHasPermission(true);
    
    // Simulate barcode scan instead of showing camera
    simulateBarcodeScan();
  };
  
  // Dummy camera permission request for expo build
  const requestCameraPermission = async () => {
    setHasPermission(true);
    setShowPermissionModal(false);
    
    // Simulate barcode scan instead of showing camera
    simulateBarcodeScan();
  };
  
  // Simulate barcode scan for expo build
  const simulateBarcodeScan = () => {
    // Generate a dummy barcode
    const dummyBarcode = 'DUMMY-' + Math.floor(Math.random() * 1000000).toString();
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScannedBarcode(dummyBarcode);
    setScanMode(false);
    
    // Prompt user to name the dummy item
    Alert.alert(
      'Dummy Barcode Generated',
      'Camera functionality is disabled for this build. A dummy barcode has been generated.',
      [{
        text: 'Cancel',
        style: 'cancel',
      }, {
        text: 'Name Item',
        onPress: () => {
          Alert.prompt(
            'Name Your Item',
            'What would you like to call this item?',
            (text) => {
              if (text) {
                setBarcodeLabel(text);
              }
            },
            'plain-text',
            'My Item',
            'default'
          );
        },
      }]
    );
  };
  
  // Dummy barcode handler for expo build
  const handleBarCodeScanned = (result: any) => {
    // This function won't be called in the dummy implementation
    // but we keep it for type compatibility
  };
  
  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(day => day !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };
  
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || alarmTime;
    setShowTimePicker(Platform.OS === 'ios');
    setAlarmTime(currentDate);
  };
  
  const saveAlarm = async () => {
    try {
      if (selectedDays.length === 0) {
        Alert.alert('Error', 'Please select at least one day for the alarm');
        return;
      }
      
      if (challengeType === 'barcode' && !scannedBarcode) {
        Alert.alert('Error', 'Please scan a barcode for the wake-up challenge');
        return;
      }
      
      // Generate a unique ID for the alarm if not editing
      const alarmId = isEditing ? params.alarmId! : Date.now().toString();
      
      // Save barcode data if using barcode challenge
      if (challengeType === 'barcode' && scannedBarcode) {
        await storeBarcode(alarmId, scannedBarcode);
      }
      
      // Create alarm data object
      const alarmData: AlarmData = {
        id: alarmId,
        time: alarmTime,
        days: selectedDays,
        label: alarmLabel,
        isActive: true,
        challengeType,
        barcode: scannedBarcode || undefined,
        barcodeLabel: barcodeLabel || undefined,
        riddleDifficulty: challengeType === 'riddle' ? riddleDifficulty : undefined,
      };
      
      // If editing, cancel the previous alarm
      if (isEditing) {
        await cancelAlarm(alarmId);
      }
      
      // Schedule the alarm
      await scheduleAlarm(alarmData);
      
      // Navigate back to the alarms list
      router.back();
    } catch (error) {
      console.error('Failed to save alarm:', error);
      Alert.alert('Error', 'Failed to save alarm');
    }
  };
  
  if (scanMode && hasPermission) {
    return (
      <View style={styles.container}>
        <View style={[styles.camera, { backgroundColor: colors.cardBackground }]}>
          {/* Dummy camera view for Expo build */}
          <View style={styles.dummyCameraView}>
            <FontAwesome name="barcode" size={50} color={colors.primary} />
            <Text style={[styles.dummyText, { color: colors.text }]}>
              Camera disabled for Expo build
            </Text>
            <Text style={[styles.dummySubText, { color: colors.mediumGray }]}>
              Tap the button below to simulate a barcode scan
            </Text>
            
            <TouchableOpacity 
              style={[styles.scanButton, { backgroundColor: colors.primary, marginTop: 20 }]}
              onPress={() => {
                // Simulate a barcode scan with a dummy value
                handleBarCodeScanned({ type: 'dummy', data: 'dummy-barcode-123456789' });
              }}
            >
              <Text style={styles.buttonText}>Simulate Scan</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: colors.error }]}
            onPress={() => setScanMode(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {isEditing ? 'Edit Alarm' : 'Create New Alarm'}
      </Text>
      
      {/* Time Picker */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Alarm Time</Text>
        <TouchableOpacity 
          style={[styles.timePickerButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={[styles.timeText, { color: colors.primary }]}>
            {alarmTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        
        {showTimePicker && (
          <DateTimePicker
            value={alarmTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      
      {/* Days Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Repeat</Text>
        <View style={styles.daysContainer}>
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDays.includes(index) ? 
                  { backgroundColor: colors.primary } : 
                  { backgroundColor: 'transparent', borderColor: colors.mediumGray }
              ]}
              onPress={() => toggleDay(index)}
            >
              <Text 
                style={[
                  styles.dayText, 
                  { color: selectedDays.includes(index) ? 'white' : colors.text }
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Alarm Label */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Label</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardBackground, color: colors.text }]}
          placeholder="Alarm label (optional)"
          placeholderTextColor={colors.mediumGray}
          value={alarmLabel}
          onChangeText={setAlarmLabel}
        />
      </View>
      
      {/* Challenge Type */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Wake-up Challenge</Text>
        <View style={styles.challengeTypeContainer}>
          <TouchableOpacity
            style={[
              styles.challengeButton,
              challengeType === 'barcode' ? 
                { backgroundColor: colors.primary } : 
                { backgroundColor: 'transparent', borderColor: colors.mediumGray }
            ]}
            onPress={() => setChallengeType('barcode')}
          >
            <FontAwesome 
              name="barcode" 
              size={24} 
              color={challengeType === 'barcode' ? 'white' : colors.text} 
            />
            <Text 
              style={[
                styles.challengeText, 
                { color: challengeType === 'barcode' ? 'white' : colors.text }
              ]}
            >
              Barcode Scan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.challengeButton,
              challengeType === 'riddle' ? 
                { backgroundColor: colors.primary } : 
                { backgroundColor: 'transparent', borderColor: colors.mediumGray }
            ]}
            onPress={() => setChallengeType('riddle')}
          >
            <FontAwesome 
              name="question-circle" 
              size={24} 
              color={challengeType === 'riddle' ? 'white' : colors.text} 
            />
            <Text 
              style={[
                styles.challengeText, 
                { color: challengeType === 'riddle' ? 'white' : colors.text }
              ]}
            >
              Riddle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Barcode Challenge Settings */}
      {challengeType === 'barcode' && (
        <View style={styles.section}>
          <View style={styles.barcodeContainer}>
            {scannedBarcode ? (
              <View style={[styles.barcodeInfo, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.barcodeTextContainer}>
                  <Text style={[styles.barcodeLabel, { color: colors.text }]}>
                    {barcodeLabel || 'Unnamed Item'}
                  </Text>
                  <Text style={[styles.barcodeData, { color: colors.mediumGray }]}>
                    {scannedBarcode.substring(0, 20)}...
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.iconButton, { backgroundColor: colors.primary }]}
                  onPress={checkCameraPermission}
                >
                  <FontAwesome name="refresh" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.scanButton, { backgroundColor: colors.primary }]}
                onPress={checkCameraPermission}
              >
                <FontAwesome name="barcode" size={24} color="white" />
                <Text style={styles.buttonText}>Scan Barcode</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      {/* Riddle Challenge Settings */}
      {challengeType === 'riddle' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Riddle Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyButton,
                  riddleDifficulty === difficulty ? 
                    { backgroundColor: colors.primary } : 
                    { backgroundColor: 'transparent', borderColor: colors.mediumGray }
                ]}
                onPress={() => setRiddleDifficulty(difficulty as 'easy' | 'medium' | 'hard')}
              >
                <Text 
                  style={[
                    styles.difficultyText, 
                    { color: riddleDifficulty === difficulty ? 'white' : colors.text }
                  ]}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      
      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={saveAlarm}
      >
        <Text style={styles.buttonText}>Save Alarm</Text>
      </TouchableOpacity>
      
      {/* Permission Modal */}
      <PermissionModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onGrant={requestCameraPermission}
        permissionType="camera"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  dummyCameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dummyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  dummySubText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  timePickerButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  dayText: {
    fontWeight: '600',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  challengeTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.48,
  },
  challengeText: {
    fontWeight: '600',
    marginLeft: 10,
  },
  barcodeContainer: {
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  barcodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  barcodeTextContainer: {
    flex: 1,
  },
  barcodeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  barcodeData: {
    fontSize: 14,
    marginTop: 5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 0.3,
    alignItems: 'center',
  },
  difficultyText: {
    fontWeight: '600',
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanInstructionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanInstructionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    maxWidth: '80%',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
});