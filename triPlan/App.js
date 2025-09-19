// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Pantallas/pantallaPrincipal';  // Importa la pantalla de inicio
import SecondScreen from './Pantallas/segundaPantalla';  // Importa la segunda pantalla

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pantalla Principal' }} />
        <Stack.Screen name="Second" component={SecondScreen} options={{ title: 'Segunda Pantalla' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

