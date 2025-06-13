// src/components/BarberCard.js
// Este componente exibe um card para cada cabeleireiro na lista.
// Ele mostra informações como nome, endereço, avaliação, status de abertura e serviços.
// Ao ser pressionado, ele navega para a tela de detalhes do cabeleireiro.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BarberCard = ({ barber }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('BarberDetails', { barberId: barber.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
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
          <Text style={styles.name} numberOfLines={1} ellipsizeMode='tail'>{barber.name || 'Nome não disponível'}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{typeof barber.rating === 'number' ? barber.rating.toFixed(1) : 'N/A'}</Text>
          </View>
        </View>
        
        <Text style={styles.address} numberOfLines={1} ellipsizeMode='tail'>{barber.address || 'Endereço não disponível'}</Text>
        
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: barber.isOpen ? '#4CAF50' : '#F44336' }
            ]} />
            <Text style={styles.statusText}>
              {barber.isOpen ? 'Aberto' : 'Fechado'}
            </Text>
          </View>
          
          <View style={styles.servicesArea}>
            {Array.isArray(barber.services) && barber.services.length > 0 ? (
              <Text style={styles.servicesTitle}>Serviços:</Text>
            ) : null}
            <View style={styles.serviceTags}>
              {Array.isArray(barber.services) && barber.services.length > 0 ? (
                barber.services.map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{service || 'Serviço não especificado'}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.servicesText}>Serviços não especificados</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  servicesArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  serviceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 11,
    color: '#666',
  },
  servicesText: {
    fontSize: 12,
    color: '#666',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: '#666',
  },
});

export default BarberCard; 