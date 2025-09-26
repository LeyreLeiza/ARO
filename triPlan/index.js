import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import PantallaPrincipal from './Pantallas/pantallaPrincipal';
import SegundaPantalla from './Pantallas/segundaPantalla';
import HomeIcon from './assets/HomeIcon';
import MapIcon from './assets/MapIcon';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); 

// Componente de navegación con Tabs
const TabNavigation = () => {
  return (
    <Tab.Navigator 
        initialRouteName="Principal" 
        screenOptions={{
            tabBarActiveTintColor: 'tomato',     // Color cuando está activa la tab
            tabBarInactiveTintColor: 'gray',     // Color cuando está inactiva
        }}>
      <Tab.Screen
        name="Principal"
        component={PantallaPrincipal}
        
        options={{ 
            title: 'Pantalla Principal', 
            tabBarIcon: ({ color, size }) => (
                <HomeIcon size={size} stroke={color} />            
            )
        }}
      />
      <Tab.Screen
        name="Segunda"
        component={SegundaPantalla}
        options={{ 
            title: 'Segunda Pantalla',
            tabBarIcon: ({ color, size }) => (
                <MapIcon size={size} stroke={color} />            
            )
        }}
      />
    </Tab.Navigator>
  );
};

const NavigationSetup = () => {
  return (
    <NavigationContainer>
      {/* Usar el TabNavigation dentro del Stack o directamente */}
      <TabNavigation />
    </NavigationContainer>
  );
};

AppRegistry.registerComponent('main', () => NavigationSetup);