import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Welcome from  "./components/Welcome"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Introduction from './components/Introduction';
import { useEffect } from 'react';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Introduction" component={Introduction} options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

});
