import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
// Camera functionality commented out for expo build
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { CameraType } from 'expo-camera/build/Camera.types';
// import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Timer from '@/components/Timer';
import PermissionModal from '@/components/PermissionModal';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CameraChallengeProps {
  onComplete: () => void;
  targetBarcode?: string;
  timeLimit?: number; // in seconds
  onFallback?: () => void; // Function to switch to riddle challenge
}

export default function CameraChallenge({ 
  onComplete, 
  targetBarcode, 
  timeLimit = 60,
  onFallback
}: CameraChallengeProps) {
  // Dummy state for expo build
  const [scanned, setScanned] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Dummy permission state for expo build
  const [hasPermission, setHasPermission] = useState(true);
  
  // Simulate permission request for expo build
  const requestCameraPermission = async () => {
    setShowPermissionModal(false);
    setHasPermission(true);
  };
  
  // Auto-complete the challenge after a delay for expo build
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate successful scan
      handleBarCodeScanned({ type: 'dummy', data: targetBarcode || 'dummy-barcode' });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Dummy barcode handler for expo build
  const handleBarCodeScanned = ({ type, data }: any) => {
    if (scanned) return;
    
    setScanned(true);
    
    // Always simulate successful scan for expo build
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const handleTimerEnd = () => {
    // Time's up, offer fallback option
    if (onFallback) {
      Alert.alert(
        'Time\'s Up!',
        'Would you like to try a riddle challenge instead?',
        [
          { text: 'Keep Scanning', onPress: () => {} },
          { text: 'Try Riddle', onPress: onFallback }
        ]
      );
    }
  };

  // Dummy torch toggle for expo build
  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  // Always show the main UI for expo build
  if (false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.camera, { backgroundColor: '#000' }]}>
        {/* Dummy camera view for expo build */}
        <View style={styles.dummyCameraView}>
          <Text style={styles.dummyText}>Camera Disabled for Build</Text>
          <Text style={styles.dummySubText}>Automatically completing in 3 seconds...</Text>
          {!scanned && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary, marginTop: 20 }]}
              onPress={() => handleBarCodeScanned({ type: 'dummy', data: targetBarcode || 'dummy-barcode' })}
            >
              <Text style={styles.buttonText}>Complete Now</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.timerContainer}>
          <Timer 
            initialTimeInSeconds={timeLimit} 
            onTimerEnd={handleTimerEnd} 
            size="medium"
          />
        </View>
        
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
            <View style={[styles.cornerTR, { borderColor: colors.primary }]} />
            <View style={[styles.cornerBL, { borderColor: colors.primary }]} />
            <View style={[styles.cornerBR, { borderColor: colors.primary }]} />
          </View>
        </View>
        
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            {scanned ? 'Completed!' : 'Camera functionality disabled for build'}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          {onFallback && (
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: colors.secondary }]}
              onPress={onFallback}
            >
              <FontAwesome name="question" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  dummyCameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dummyText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  dummySubText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  overlay: {
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
  instructionContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
});