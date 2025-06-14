import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface TimerProps {
  initialTimeInSeconds: number;
  onTimerEnd: () => void;
  size?: 'small' | 'medium' | 'large';
  showMinutesSeconds?: boolean;
}

export default function Timer({ 
  initialTimeInSeconds, 
  onTimerEnd, 
  size = 'medium',
  showMinutesSeconds = true 
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Animation value for progress circle
  const animatedValue = useRef(new Animated.Value(1)).current;
  
  // Set up timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimerEnd();
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          onTimerEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Clean up timer
    return () => clearInterval(timerId);
  }, [timeLeft, onTimerEnd]);
  
  // Set up animation
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: timeLeft / initialTimeInSeconds,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, initialTimeInSeconds, animatedValue]);
  
  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get size based on prop
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60, fontSize: 16 };
      case 'large':
        return { width: 120, height: 120, fontSize: 32 };
      case 'medium':
      default:
        return { width: 80, height: 80, fontSize: 24 };
    }
  };
  
  const { width, height, fontSize } = getSize();
  
  // Calculate stroke width based on size
  const strokeWidth = width * 0.1;
  
  // Calculate radius
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dash based on time left
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });
  
  // Get color based on time left percentage
  const getColor = () => {
    const percentage = timeLeft / initialTimeInSeconds;
    if (percentage > 0.6) return colors.success;
    if (percentage > 0.3) return colors.warning;
    return colors.error;
  };
  
  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View style={styles.progressContainer}>
        <Svg width={width} height={height}>
          {/* Background Circle */}
          <Circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={colors.lightGray}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
      
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { fontSize, color: colors.text }]}>
          {showMinutesSeconds ? formatTime(timeLeft) : timeLeft}
        </Text>
      </View>
    </View>
  );
}

// Import SVG components
import Svg, { Circle } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    transform: [{ rotateZ: '-90deg' }],
  },
  timeContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
  },
});