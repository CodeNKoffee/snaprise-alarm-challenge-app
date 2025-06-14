import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import RiddleChallenge from './RiddleChallenge';
import { AlarmData, generateAlarmId } from '@/utils/alarmUtils';

export default function TestScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // State for test options
  const [buddyModeEnabled, setBuddyModeEnabled] = useState(true);
  const [riddleDifficulty, setRiddleDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showRiddleTest, setShowRiddleTest] = useState(false);
  
  // Function to test Buddy Mode
  const testBuddyMode = () => {
    // Create a mock alarm with buddy mode enabled
    const mockAlarm: AlarmData = {
      id: generateAlarmId(),
      time: new Date(),
      challengeType: 'riddle',
      isActive: true,
      days: [0, 1, 2, 3, 4, 5, 6],
      label: 'Buddy Mode Test'
    };
    
    // Navigate to wake screen with buddy mode parameter
    router.push({
      pathname: '/wake',
      params: { 
        alarmId: mockAlarm.id,
        buddyMode: buddyModeEnabled ? 'true' : 'false'
      }
    });
  };
  
  // Function to handle riddle completion
  const handleRiddleComplete = () => {
    setShowRiddleTest(false);
    Alert.alert('Success!', 'You completed the riddle challenge!');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Test Features</Text>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Buddy Mode Test Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Buddy Mode Test</Text>
          <Text style={[styles.description, { color: colors.mediumGray }]}>
            Buddy Mode prevents users from canceling alarms. Test how it works here.
          </Text>
          
          <View style={styles.optionRow}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>Enable Buddy Mode</Text>
            <Switch
              value={buddyModeEnabled}
              onValueChange={setBuddyModeEnabled}
              trackColor={{ false: colors.lightGray, true: colors.secondary }}
              thumbColor={buddyModeEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: colors.primary }]}
            onPress={testBuddyMode}
          >
            <FontAwesome name="user-plus" size={18} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Test Buddy Mode</Text>
          </TouchableOpacity>
        </View>
        
        {/* Riddle Challenge Test Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Riddle Challenge Test</Text>
          <Text style={[styles.description, { color: colors.mediumGray }]}>
            Test the riddle challenge with different difficulty levels.
          </Text>
          
          <View style={styles.optionRow}>
            <Text style={[styles.optionLabel, { color: colors.text }]}>Difficulty</Text>
            <View style={styles.difficultyButtons}>
              {['easy', 'medium', 'hard'].map((level) => (
                <TouchableOpacity 
                  key={level}
                  style={[
                    styles.difficultyButton,
                    riddleDifficulty === level ? 
                      { backgroundColor: colors.primary } : 
                      { backgroundColor: colors.lightGray }
                  ]}
                  onPress={() => setRiddleDifficulty(level as 'easy' | 'medium' | 'hard')}
                >
                  <Text 
                    style={[
                      styles.difficultyText,
                      { color: riddleDifficulty === level ? 'white' : colors.text }
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.testButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowRiddleTest(true)}
          >
            <FontAwesome name="question-circle" size={18} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Test Riddle Challenge</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color={colors.primary} style={styles.buttonIcon} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Settings</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Riddle Challenge Test Modal */}
      {showRiddleTest && (
        <View style={styles.riddleOverlay}>
          <View style={[styles.riddleContainer, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.riddleHeader}>
              <Text style={[styles.riddleTitle, { color: colors.text }]}>Riddle Challenge</Text>
              <TouchableOpacity onPress={() => setShowRiddleTest(false)}>
                <FontAwesome name="times" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <RiddleChallenge 
              onComplete={handleRiddleComplete} 
              difficulty={riddleDifficulty}
              timeLimit={60}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyButtons: {
    flexDirection: 'row',
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  riddleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  riddleContainer: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  riddleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  riddleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});