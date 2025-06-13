// src/navigation/AppNavigator.js
// Este arquivo configura a navegação principal do aplicativo usando @react-navigation.
// Define as telas que podem ser acessadas e como elas se relacionam (em pilha).

import React from 'react';
// Importa a função para criar um Navigator baseado em pilha.
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importa os componentes de tela que serão usados na navegação.
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import BarberDetailsScreen from '../screens/BarberDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeList" 
      component={HomeScreen}
      options={{ title: 'Lista de Cabeleireiros' }}
    />
    <Stack.Screen 
      name="BarberDetails" 
      component={BarberDetailsScreen}
      options={{ title: 'Detalhes do Cabeleireiro' }}
    />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MapView" 
      component={MapScreen}
      options={{ title: 'Mapa' }}
    />
    <Stack.Screen 
      name="BarberDetails" 
      component={BarberDetailsScreen}
      options={{ title: 'Detalhes do Cabeleireiro' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Map') {
              iconName = focused ? 'map' : 'map-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 