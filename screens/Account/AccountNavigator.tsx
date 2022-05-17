import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import theme from '../../theme';
import { AccountStackParamList, NewsStackParamList } from '../../types/navigation';
import { useKeycloak } from 'expo-keycloak-auth';
import DsekIcon from '~/components/Icons/DsekIcon';
import AccountScreen from '.';

type Props = {};

const Stack = createNativeStackNavigator<AccountStackParamList>();

const AccountStackNavigator: React.FC<Props> = (props) => {
  const colorScheme = useColorScheme();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme[colorScheme].colors.primary,
    },
    headerTitleStyle: {
      color: theme[colorScheme].colors.text,
    },
  };
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Account" screenOptions={screenOptions}>
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{
            title: 'Konto',
            headerLeft: () => <DsekIcon fill="white" width={24} height={24} />,
          }}
        />
      </Stack.Navigator>
      <StatusBar />
    </View>
  );
};

export default AccountStackNavigator;
