import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // Get from local storage by key
    const getItem = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        // Parse stored json or if none return initialValue
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.log('Error getting stored value:', error);
        setStoredValue(initialValue);
      }
    };

    getItem();
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that persists the new value to AsyncStorage
  const setValue = async (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save to state
      setStoredValue(valueToStore);
      // Save to AsyncStorage
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log('Error setting stored value:', error);
    }
  };

  return [storedValue, setValue];
}