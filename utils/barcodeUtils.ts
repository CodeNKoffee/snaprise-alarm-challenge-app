import AsyncStorage from '@react-native-async-storage/async-storage';

// Key prefix for storing barcode data
const BARCODE_KEY_PREFIX = 'snaprise_barcode_';

/**
 * Store a barcode for a specific alarm
 * @param alarmId The ID of the alarm
 * @param barcode The barcode data to store
 */
export const storeBarcode = async (alarmId: string, barcode: string): Promise<void> => {
  try {
    const key = `${BARCODE_KEY_PREFIX}${alarmId}`;
    await AsyncStorage.setItem(key, barcode);
  } catch (error) {
    console.error('Error storing barcode:', error);
    throw error;
  }
};

/**
 * Retrieve the barcode data for a specific alarm
 * @param alarmId The ID of the alarm
 * @returns The barcode data or null if not found
 */
export const getBarcodeData = async (alarmId: string): Promise<string | null> => {
  try {
    const key = `${BARCODE_KEY_PREFIX}${alarmId}`;
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error retrieving barcode:', error);
    return null;
  }
};

/**
 * Clear the barcode data for a specific alarm
 * @param alarmId The ID of the alarm
 */
export const clearBarcode = async (alarmId: string): Promise<void> => {
  try {
    const key = `${BARCODE_KEY_PREFIX}${alarmId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing barcode:', error);
    throw error;
  }
};

/**
 * Check if a scanned barcode matches the stored barcode for an alarm
 * @param alarmId The ID of the alarm
 * @param scannedBarcode The barcode that was scanned
 * @returns True if the barcodes match, false otherwise
 */
export const checkBarcodeMatch = async (alarmId: string, scannedBarcode: string): Promise<boolean> => {
  try {
    const storedBarcode = await getBarcodeData(alarmId);
    return storedBarcode === scannedBarcode;
  } catch (error) {
    console.error('Error checking barcode match:', error);
    return false;
  }
};