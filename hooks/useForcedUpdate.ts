import * as Updates from 'expo-updates';
import { useEffect } from 'react';

/**
 * returns true if update has been checked and is latest, if false you should keep the user on the splash screen
 * */
export default function useForcedUpdate() {
  const { isUpdateAvailable, isChecking, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return;
    if (isUpdateAvailable) {
      Updates.fetchUpdateAsync();
    }
  }, [isUpdateAvailable]);

  return !isChecking && !isUpdateAvailable && !isUpdatePending;
}
