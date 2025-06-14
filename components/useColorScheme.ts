import { useEffect } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
import { useLocalStorage } from './useLocalStorage';

// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.
export type ColorScheme = 'light' | 'dark';

export function useColorScheme(): ColorScheme {
  const systemColorScheme = _useColorScheme() as ColorScheme;
  const [storedColorScheme, setStoredColorScheme] = useLocalStorage<ColorScheme | null>('colorScheme', null);

  // If the user has explicitly chosen a color scheme, use that
  // Otherwise, use the system color scheme
  return storedColorScheme || systemColorScheme;
}

export function useSetColorScheme() {
  const [, setStoredColorScheme] = useLocalStorage<ColorScheme | null>('colorScheme', null);
  
  return (colorScheme: ColorScheme | null) => {
    setStoredColorScheme(colorScheme);
  };
}