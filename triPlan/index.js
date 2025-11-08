import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import PantallaMapa from './Pantallas/pantallaMapa';
import PantallaBusqueda from './Pantallas/pantallaRutas';
import PantallaEventos from './Pantallas/pantallaEventos'
import PantallaConfiguracion from './Pantallas/pantallaConfiguracion'
import CalendarIcon from './assets/CalendarIcon';
import MapIcon from './assets/MapIcon';
import SettingsIcon from './assets/SettingsIcon';
import LoginScreen from './Pantallas/pantallaLogin';
import RegisterScreen from './Pantallas/pantallaRegistro';
import ChangePasswordScreen from './Pantallas/pantallaCambiarContraseña';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); 

// Componente de navegación con Tabs
const TabNavigation = () => {
  return (
    <Tab.Navigator 
        initialRouteName="Mapa" 
        screenOptions={{
            tabBarActiveTintColor: 'tomato',     // Color cuando está activa la tab
            tabBarInactiveTintColor: 'gray',     // Color cuando está inactiva
        }}>
      <Tab.Screen
        name="Mapa"
        component={PantallaMapa}
        options={{ 
            title: 'Mapa',
            tabBarIcon: ({ color, size }) => (
                <MapIcon size={size} stroke={color} />            
            )
        }}
      />

      <Tab.Screen
        name="Eventos"
        component={PantallaEventos}
        options={{ 
            title: 'Eventos',
            tabBarIcon: ({ color, size }) => (
                <CalendarIcon size={size} stroke={color} />            
            )
        }}
      />

      <Tab.Screen
        name="Rutas"
        component={PantallaBusqueda}
        options={{ 
            title: 'Rutas',
            tabBarIcon: ({ color, size }) => (
<FontAwesome5 name="route" size={24} color={ color } />            )
        }}
      />

      <Tab.Screen
        name="Configuracion"
        component={PantallaConfiguracion}
        options={{ 
            title: 'Configuracion',
            tabBarIcon: ({ color, size }) => (
                <SettingsIcon size={size} stroke={color} />            
            )
        }}
      />
    </Tab.Navigator>
  );
};

const NavigationSetup = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App">
        <Stack.Screen 
          name="App" 
          component={TabNavigation} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Password change" 
          component={ChangePasswordScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent('main', () => NavigationSetup);

