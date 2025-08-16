import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Welcome from  "./components/Welcome"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Introduction from './components/Introduction';
import { useEffect } from 'react';
import Aesthetic from './components/Aesthetic';
import Recipes from './components/Recipes';
import PlayList from './components/PlayList';
import Registration from './components/Registration';
import Login from './components/Login';

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
                <Stack.Screen name="Aesthetic" component={Aesthetic} options={{ headerShown: false }}/>
                <Stack.Screen name="Recipes" component={Recipes} options={{headerShown:false}}/>
                <Stack.Screen name="PlayList" component={PlayList} options={{headerShown:false}}/>  
                <Stack.Screen name="Registration" component={Registration} options={{headerShown:false}}/>  
               <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />                  
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

});
