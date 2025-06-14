import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * This hook is used to get a value only on the client side.
 * During server-side rendering, it will return the initial value.
 */
export function useClientOnlyValue<T>(clientValue: T, initialValue: T): T {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(clientValue);
  }, [clientValue]);

  return value;
}

/**
 * This hook is used to get a platform-specific value.
 * On web, it will return the webValue.
 * On native, it will return the nativeValue.
 */
export function usePlatformValue<T>({ web, native }: { web: T; native: T }): T {
  return Platform.select({
    web,
    default: native,
  }) as T;
}