import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from './components/Themed';
import useColorScheme from './hooks/useColorScheme';
import NewsStackNavigator from './screens/News/StackNavigator';
import theme from './theme';
import { RootTabParamList } from './types/navigation';

type Props = {};

const Tab = createBottomTabNavigator<RootTabParamList>();

const TabNavigator: React.FC<Props> = (props) => {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: theme[colorScheme].colors.primary },
          tabBarActiveTintColor: theme[colorScheme].colors.accent,
          tabBarInactiveTintColor: theme[colorScheme].colors.text,
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          name="news-tab"
          component={NewsStackNavigator}
          options={{
            title: 'Nyheter',
            tabBarIcon: (props) => (
              <Ionicons name="newspaper-outline" size={32} color={props.color} />
            ),
          }}
        />
        <Tab.Screen
          name="account-tab"
          component={NewsStackNavigator}
          options={{
            title: 'Konto',
            tabBarIcon: (props) => (
              <MaterialIcons name="account-circle" size={32} color={props.color} />
            ),
          }}
        />
      </Tab.Navigator>
      <StatusBar />
    </View>
  );
};

export default TabNavigator;
