import React from 'react';
import { StatusBar } from 'react-native';
import { LocationProvider } from './LocationContext';
import { BarbersProvider } from './BarbersContext';
import AppNavigator from './AppNavigator';

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
