import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const useAppState = (callbackOnFocus?: () => void) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        callbackOnFocus?.();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return appStateVisible;
};

export default useAppState;
