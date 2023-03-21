import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainView from '~/components/MainView';
import useCachedResources from './hooks/useCachedResources';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
const App = () => {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <MainView />
      </SafeAreaProvider>
    );
  }
};

export default App;
