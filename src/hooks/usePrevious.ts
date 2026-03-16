import { useRef, useEffect } from 'react';

/**
 * Keep track of the previous value of a state variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Check if a value has changed since the last render
 */
export function useHasChanged<T>(value: T): boolean {
  const prev = usePrevious(value);
  return prev !== value;
}