import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainView from '~/components/MainView';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const App = () => {

    return (
      <SafeAreaProvider>
        <MainView />
      </SafeAreaProvider>
    );
};

export default App;
