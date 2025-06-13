// src/screens/MapScreen.js
// Esta tela exibe um mapa com a localização dos cabeleireiros.
// Ela utiliza o contexto de barbeiros para obter a lista de cabeleireiros e exibir marcadores no mapa.
// Ao clicar em um marcador, o usuário pode navegar para a tela de detalhes do cabeleireiro.

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import { useBarbers } from '../context/BarbersContext';

const MapScreen = ({ navigation }) => {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const { barbers, loading: barbersLoading } = useBarbers();
  const [region, setRegion] = useState({
    latitude: -23.550520,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  if (locationLoading || barbersLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {barbers.map((barber) => (
          <Marker
            key={barber.id}
            coordinate={{
              latitude: barber.latitude,
              longitude: barber.longitude,
            }}
            title={barber.name}
          >
            <Callout
              onPress={() => navigation.navigate('BarberDetails', { barber })}
            >
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{barber.name}</Text>
                <Text style={styles.calloutAddress}>{barber.address}</Text>
                <View style={styles.calloutFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{barber.rating.toFixed(1)}</Text>
                  </View>
                  <Text style={[
                    styles.status,
                    { color: barber.isOpen ? '#4CAF50' : '#F44336' }
                  ]}>
                    {barber.isOpen ? 'Aberto' : 'Fechado'}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 32,
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MapScreen; 