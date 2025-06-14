import { StyleSheet, ScrollView, TouchableOpacity, View as RNView, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AlarmCard from '@/components/AlarmCard';
import { AlarmData, getScheduledAlarms, scheduleAlarm, cancelAlarm } from '@/utils/alarmUtils';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

export default function AlarmsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadAlarms();
    
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(fabAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const loadAlarms = async () => {
    setLoading(true);
    try {
      const scheduledAlarms = await getScheduledAlarms();
      setAlarms(scheduledAlarms);
    } catch (error) {
      console.error('Failed to load alarms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlarm = async (id: string, isActive: boolean) => {
    const updatedAlarms = alarms.map(alarm => {
      if (alarm.id === id) {
        const updatedAlarm = { ...alarm, isActive };
        if (isActive) {
          scheduleAlarm(updatedAlarm);
        } else {
          cancelAlarm(id);
        }
        return updatedAlarm;
      }
      return alarm;
    });
    
    setAlarms(updatedAlarms);
  };

  const handleEditAlarm = (alarm: AlarmData) => {
    // Navigate to edit screen with alarm data
    router.push({
      pathname: '/setup',
      params: { alarmId: alarm.id }
    });
  };

  const handleAddAlarm = () => {
    // Animate the FAB when pressed
    Animated.sequence([
      Animated.timing(fabAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.spring(fabAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();
    
    // Navigate to setup screen
    router.push('/setup');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Your Alarms</Text>
      </Animated.View>
      
      <Animated.View style={{ flex: 1, width: '100%', opacity: fadeAnim }}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {alarms.length > 0 ? (
            alarms.map((alarm, index) => (
              <Animated.View 
                key={alarm.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }],
                  // Add a slight delay for each card
                  animationDelay: `${index * 100}ms`
                }}
              >
                <AlarmCard 
                  alarm={alarm}
                  onToggle={handleToggleAlarm}
                  onEdit={handleEditAlarm}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View 
              style={[
                styles.emptyContainer, 
                { 
                  backgroundColor: 'transparent',
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <FontAwesome name="bell-slash" size={60} color={colors.mediumGray} />
              <Text style={[styles.emptyText, { color: colors.text }]}>No alarms set yet</Text>
              <Text style={[styles.emptySubText, { color: colors.mediumGray }]}>
                Tap the + button to create your first alarm
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </Animated.View>

      <Animated.View 
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          transform: [
            { scale: fabAnim },
            { translateY: fabAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            })}
          ]
        }}
      >
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary }]} 
          onPress={handleAddAlarm}
        >
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for FAB
    paddingTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
    padding: 20,
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    letterSpacing: 0.5,
  },
  emptySubText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Add a subtle border for better visibility
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
