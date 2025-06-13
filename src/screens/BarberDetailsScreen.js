// src/screens/BarberDetailsScreen.js
// Esta tela exibe os detalhes de um cabeleireiro específico.
// Ela recebe o ID do cabeleireiro como parâmetro de navegação e utiliza o contexto de barbeiros para obter os dados.
// Exibe informações como nome, endereço, avaliação, status de abertura e serviços oferecidos.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform, // Importa Platform para lógica específica de OS
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
// Importa o hook useBarbers para acessar a lista de cabeleireiros do contexto.
import { useBarbers } from '../context/BarbersContext';

const BarberDetailsScreen = ({ route }) => {
  // Obtém o ID do cabeleireiro dos parâmetros de navegação.
  const { barberId } = route.params;

  // Obtém a lista de cabeleireiros do contexto.
  const { barbers } = useBarbers();

  // Encontra o cabeleireiro específico pelo ID.
  const barber = barbers.find((b) => b.id === barberId);

  // Se o cabeleireiro não for encontrado, exibe uma mensagem de erro.
  if (!barber) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cabeleireiro não encontrado.</Text>
      </View>
    );
  }

  const handleCall = () => {
    if (barber.phone) {
      Linking.openURL(`tel:${barber.phone}`).catch(err => {
        console.error('Erro ao tentar ligar:', err);
        alert('Não foi possível realizar a chamada.');
      });
    }
  };

  const handleOpenMaps = () => {
    if (barber.latitude && barber.longitude) {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${barber.latitude},${barber.longitude}`;
      const label = encodeURIComponent(barber.name || 'Localização');
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });

      Linking.openURL(url).catch(err => {
        console.error('Erro ao abrir o Google Maps:', err);
        alert('Não foi possível abrir o mapa.');
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {barber.imageUrl && typeof barber.imageUrl === 'string' && barber.imageUrl !== '' ? (
        <Image
          source={{ uri: barber.imageUrl }}
          style={styles.image}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Sem Imagem</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{barber.name || 'Nome não disponível'}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{typeof barber.rating === 'number' ? barber.rating.toFixed(1) : 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: barber.isOpen ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.status}>
            {barber.isOpen ? 'Aberto' : 'Fechado'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.address}>{barber.address || 'Endereço não disponível'}</Text>
          {barber.latitude && barber.longitude && (
            <TouchableOpacity
              style={styles.mapButton}
              onPress={handleOpenMaps}
            >
              <Ionicons name="navigate" size={20} color="#007AFF" />
              <Text style={styles.mapButtonText}>Abrir no Mapa</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          {barber.phone ? (
            <TouchableOpacity
              style={styles.phoneButton}
              onPress={handleCall}
            >
              <Ionicons name="call" size={20} color="#007AFF" />
              <Text style={styles.phoneButtonText}>{barber.phone}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.hours}>Telefone não disponível</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horário de Funcionamento</Text>
          <Text style={styles.hours}>{barber.openingHours || 'Horário não disponível'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <View style={styles.servicesContainer}>
            {Array.isArray(barber.services) && barber.services.length > 0 ? (
              barber.services.map((service, index) => (
                <View key={index} style={styles.serviceTag}>
                  <Text style={styles.serviceText}>{service || 'Serviço não especificado'}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.hours}>Serviços não especificados</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          {barber.latitude && barber.longitude ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: barber.latitude,
                  longitude: barber.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: barber.latitude,
                    longitude: barber.longitude,
                  }}
                  title={barber.name || 'Localização'}
                />
              </MapView>
            </View>
          ) : (
            <Text style={styles.hours}>Localização não disponível</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: 200,
  },
  // Corrigido para ter a mesma altura da imagem quando não houver imagem
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0', // Um fundo claro para o placeholder
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  mapButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    flexShrink: 1,
  },
  hours: {
    fontSize: 16,
    color: '#666',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // Propriedade 'gap' é um atalho útil para espaçamento
  },
  serviceTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 14,
    color: '#1976D2',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

// Exporta a tela para ser usada na navegação.
export default BarberDetailsScreen;