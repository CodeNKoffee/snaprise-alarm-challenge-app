import { StyleSheet, Switch, TouchableOpacity, Linking, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkThemeEnabled, setDarkThemeEnabled] = useState(colorScheme === 'dark');
  const [buddyModeEnabled, setBuddyModeEnabled] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        delay: 300,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const handleAboutPress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();
    
    Linking.openURL('https://github.com/yourusername/snaprise');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>
      </Animated.View>
      
      <Animated.View 
        style={{
          width: '100%',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          // Add a slight delay for the first item
          animationDelay: '100ms'
        }}
      >
        <View style={[
          styles.settingItem, 
          { 
            backgroundColor: colors.cardBackground,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }
        ]}>
          <View style={[styles.settingTextContainer, { backgroundColor: 'transparent' }]}>
            <FontAwesome name="volume-up" size={22} color={colors.primary} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Alarm Sound</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: colors.lightGray, true: colors.secondary }}
            thumbColor={soundEnabled ? colors.primary : '#f4f3f4'}
            ios_backgroundColor={colors.lightGray}
          />
        </View>
      </Animated.View>
      
      <Animated.View 
        style={{
          width: '100%',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          // Add a slight delay for the second item
          animationDelay: '200ms'
        }}
      >
        <View style={[
          styles.settingItem, 
          { 
            backgroundColor: colors.cardBackground,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }
        ]}>
          <View style={[styles.settingTextContainer, { backgroundColor: 'transparent' }]}>
            <FontAwesome name="mobile" size={22} color={colors.primary} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Vibration</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: colors.lightGray, true: colors.secondary }}
            thumbColor={vibrationEnabled ? colors.primary : '#f4f3f4'}
            ios_backgroundColor={colors.lightGray}
          />
        </View>
      </Animated.View>
      
      <Animated.View 
        style={{
          width: '100%',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          // Add a slight delay for the third item
          animationDelay: '300ms'
        }}
      >
        <View style={[
          styles.settingItem, 
          { 
            backgroundColor: colors.cardBackground,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }
        ]}>
          <View style={[styles.settingTextContainer, { backgroundColor: 'transparent' }]}>
            <FontAwesome name="moon-o" size={22} color={colors.primary} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Dark Theme</Text>
          </View>
          <Switch
            value={darkThemeEnabled}
            onValueChange={setDarkThemeEnabled}
            trackColor={{ false: colors.lightGray, true: colors.secondary }}
            thumbColor={darkThemeEnabled ? colors.primary : '#f4f3f4'}
            ios_backgroundColor={colors.lightGray}
          />
        </View>
      </Animated.View>
      
      <Animated.View 
        style={{
          width: '100%',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          // Add a slight delay for the fourth item
          animationDelay: '400ms'
        }}
      >
        <View style={[
          styles.settingItem, 
          { 
            backgroundColor: colors.cardBackground,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }
        ]}>
          <View style={[styles.settingTextContainer, { backgroundColor: 'transparent' }]}>
            <FontAwesome name="user-plus" size={22} color={colors.primary} style={styles.settingIcon} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={[styles.settingText, { color: colors.text }]}>Buddy Mode</Text>
              <Text style={[styles.settingDescription, { color: colors.mediumGray }]}>Prevents alarm cancellation</Text>
            </View>
          </View>
          <Switch
            value={buddyModeEnabled}
            onValueChange={setBuddyModeEnabled}
            trackColor={{ false: colors.lightGray, true: colors.secondary }}
            thumbColor={buddyModeEnabled ? colors.primary : '#f4f3f4'}
            ios_backgroundColor={colors.lightGray}
          />
        </View>
      </Animated.View>
      
      <Animated.View 
        style={{
          width: '100%',
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          // Add a slight delay for the fifth item
          animationDelay: '500ms'
        }}
      >
        <TouchableOpacity 
          style={[
            styles.settingItem, 
            { 
              backgroundColor: colors.cardBackground,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          ]}
          onPress={() => router.push('/test')}
          activeOpacity={0.7}
        >
          <View style={[styles.settingTextContainer, { backgroundColor: 'transparent' }]}>
            <FontAwesome name="flask" size={22} color={colors.primary} style={styles.settingIcon} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={[styles.settingText, { color: colors.text }]}>Test Features</Text>
              <Text style={[styles.settingDescription, { color: colors.mediumGray }]}>Try Buddy Mode and Riddle Challenge</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={16} color={colors.mediumGray} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View 
        style={{
          width: '100%',
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [
            { scale: buttonAnim },
            { translateY: slideAnim }
          ]
        }}
      >
        <TouchableOpacity 
          style={[
            styles.aboutButton, 
            { 
              backgroundColor: colors.primary,
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          ]} 
          onPress={handleAboutPress}
          activeOpacity={0.8}
        >
          <Text style={styles.aboutButtonText}>About SnapRise</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 36,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    width: '100%',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 14,
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  settingDescription: {
    fontSize: 14,
    marginLeft: 5,
  },
  aboutButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
  },
  aboutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
