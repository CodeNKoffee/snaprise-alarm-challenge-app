import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Switch, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { AlarmData } from '@/utils/alarmUtils';
import { useColorScheme } from '@/components/useColorScheme';

interface AlarmCardProps {
  alarm: AlarmData;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (alarm: AlarmData) => void;
}

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AlarmCard({ alarm, onToggle, onEdit }: AlarmCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Animation values
  const [scaleAnim] = React.useState(new Animated.Value(1));
  
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleToggle = () => {
    // Animate the toggle
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    onToggle(alarm.id, !alarm.isActive);
  };

  const handlePress = () => {
    // Animate the press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    onEdit(alarm);
  };

  const getChallengeIcon = () => {
    return alarm.challengeType === 'barcode' ? 'barcode' : 'question-circle';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[
          styles.card, 
          !alarm.isActive && styles.inactiveCard,
          { backgroundColor: colors.cardBackground }
        ]} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.timeContainer, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.time, { color: colors.text }]}>
            {formatTime(new Date(alarm.time))}
          </Text>
          <View style={[styles.daysContainer, { backgroundColor: 'transparent' }]}>
            {dayLabels.map((day, index) => (
              <Text 
                key={index} 
                style={[
                  styles.dayLabel, 
                  { color: colors.mediumGray },
                  alarm.days.includes(index) && [styles.activeDayLabel, { color: colors.primary }]
                ]}
              >
                {day}
              </Text>
            ))}
          </View>
        </View>

        <View style={[styles.rightContainer, { backgroundColor: 'transparent' }]}>
          <View style={[styles.challengeContainer, { backgroundColor: 'transparent' }]}>
            <FontAwesome 
              name={getChallengeIcon()} 
              size={16} 
              color={colors.primary} 
              style={styles.challengeIcon} 
            />
            <Text style={[styles.challengeText, { color: colors.darkGray }]}>
              {alarm.challengeType === 'barcode' ? 'Barcode Scan' : 'Riddle'}
            </Text>
          </View>
          
          <Switch
            value={alarm.isActive}
            onValueChange={handleToggle}
            trackColor={{ false: colors.lightGray, true: colors.secondary }}
            thumbColor={alarm.isActive ? colors.primary : '#f4f3f4'}
            ios_backgroundColor={colors.lightGray}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inactiveCard: {
    opacity: 0.7,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  daysContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  dayLabel: {
    fontSize: 13,
    marginRight: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeDayLabel: {
    fontWeight: 'bold',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  challengeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(121, 101, 193, 0.1)',
  },
  challengeIcon: {
    marginRight: 6,
  },
  challengeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});