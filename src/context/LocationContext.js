import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return false;
      }
      return true;
    } catch (error) {
      setErrorMsg('Erro ao solicitar permissão de localização');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg('Erro ao obter localização');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        errorMsg,
        loading,
        getCurrentLocation,
        requestLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation deve ser usado dentro de um LocationProvider');
  }
  return context;
}; 