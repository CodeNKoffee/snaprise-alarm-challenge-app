import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { getRandomRiddle, checkRiddleAnswer, Riddle } from '@/utils/riddles';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Timer from '@/components/Timer';
import * as Haptics from 'expo-haptics';

interface RiddleChallengeProps {
  onComplete: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in seconds
}

export default function RiddleChallenge({ 
  onComplete, 
  difficulty = 'easy',
  timeLimit = 60 
}: RiddleChallengeProps) {
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Load a random riddle on component mount
  useEffect(() => {
    setRiddle(getRandomRiddle(difficulty));
  }, [difficulty]);

  const handleSubmit = () => {
    if (!riddle || answer.trim() === '') return;
    
    Keyboard.dismiss();
    setAttempts(attempts + 1);
    
    if (checkRiddleAnswer(riddle, answer)) {
      setIsCorrect(true);
      setFeedback('Correct! Well done!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Delay completion to show success message
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setFeedback('Incorrect. Try again!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Show hint after 3 failed attempts
      if (attempts >= 2 && !showHint) {
        setShowHint(true);
      }
    }
  };

  const handleSkip = () => {
    // Load a new riddle
    setRiddle(getRandomRiddle(difficulty));
    setAnswer('');
    setFeedback('');
    setIsCorrect(false);
    setAttempts(0);
    setShowHint(false);
  };

  const handleTimerEnd = () => {
    // Time's up, show an easier riddle
    setRiddle(getRandomRiddle('easy'));
    setAnswer('');
    setFeedback('Time\'s up! Here\'s an easier riddle.');
    setIsCorrect(false);
    setAttempts(0);
    setShowHint(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  // Generate a hint by revealing the first letter and length
  const generateHint = (answer: string) => {
    if (!answer) return '';
    return `Hint: Starts with "${answer[0].toUpperCase()}", ${answer.length} letters`;
  };

  if (!riddle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading riddle...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.timerContainer}>
        <Timer 
          initialTimeInSeconds={timeLimit} 
          onTimerEnd={handleTimerEnd} 
          size="medium"
        />
      </View>
      
      <View style={styles.riddleContainer}>
        <Text style={[styles.title, { color: colors.primary }]}>Wake Up Challenge</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>Solve this riddle to dismiss the alarm</Text>
        
        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>{riddle.question}</Text>
        </View>
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.cardBackground, 
            color: colors.text,
            borderColor: isCorrect ? colors.success : feedback ? colors.error : colors.lightGray
          }]}
          placeholder="Your answer"
          placeholderTextColor={colors.mediumGray}
          value={answer}
          onChangeText={setAnswer}
          onSubmitEditing={handleSubmit}
          editable={!isCorrect}
          autoCapitalize="none"
        />
        
        {feedback ? (
          <Text style={[styles.feedback, { 
            color: isCorrect ? colors.success : colors.error 
          }]}>{feedback}</Text>
        ) : null}
        
        {showHint && !isCorrect ? (
          <Text style={[styles.hint, { color: colors.secondary }]}>
            {generateHint(riddle.answer)}
          </Text>
        ) : null}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            disabled={isCorrect}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          
          {!isCorrect && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.mediumGray }]}
              onPress={handleSkip}
            >
              <Text style={styles.buttonText}>Try Another</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timerContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  riddleContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  questionCard: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 15,
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedback: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 18,
  },
});