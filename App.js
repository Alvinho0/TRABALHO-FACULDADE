import React from 'react';
import { StatusBar } from 'react-native';
import { LocationProvider } from './src/context/LocationContext';
import { BarbersProvider } from './src/context/BarbersContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LocationProvider>
        <BarbersProvider>
          <AppNavigator />
        </BarbersProvider>
      </LocationProvider>
    </>
  );
} 