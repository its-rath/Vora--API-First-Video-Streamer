import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { getToken } from './services/auth';
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#0f0f0f' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} options={{ title: 'Playing Video' }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setUserToken(token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ff0050" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
        {userToken ? (
          <>
            <Stack.Screen name="App" component={AppStack} />
            <Stack.Screen name="Auth" component={AuthStack} />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="App" component={AppStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
