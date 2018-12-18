import { EffectCallback, useEffect, useReducer, useRef } from 'react';
import isEqual from 'lodash/isEqual';

export function useSetState<T = any>(initState: T): [T, (arg: Partial<T>) => void] {
  const [state, setState] = useReducer(
    (givenState, newState: Partial<T>) => ({ ...givenState, ...newState }),
    initState,
  );

  return [state, setState];
}

export function useSafeSetSate<T = any>(initState: T): [T, (arg: Partial<T>) => void] {
  const [state, setState] = useSetState(initState);

  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const safeSetState = (arg: Partial<T>) => mountedRef.current && setState(arg);

  return [state, safeSetState];
}

export function usePrevious<T = any>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function useDeepCompareEffect<T extends any[]>(callback: EffectCallback, inputs: T) {
  const cleanupRef = useRef((() => {
    return undefined;
  }) as ReturnType<EffectCallback>);

  useEffect(() => {
    if (!isEqual(prevInputs, inputs)) {
      cleanupRef.current = callback();
    }

    return cleanupRef.current;
  });

  const prevInputs = usePrevious(inputs);
}
