import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainView from '~/components/MainView';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { ApiAccessProvider } from './providers/ApiAccessProvider';
import LoginProvider from './providers/LoginProvider';
import { UserProvider } from './providers/UserProvider';

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
