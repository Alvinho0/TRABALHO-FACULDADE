// src/components/FilterModal.js
// Este componente exibe um modal que permite ao usuário aplicar filtros à lista de cabeleireiros.
// Os filtros incluem status de abertura, avaliação mínima e serviços oferecidos.
// Ao aplicar os filtros, ele atualiza o estado global no contexto de barbeiros.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBarbers } from '../context/BarbersContext';

const AVAILABLE_SERVICES = [
  'Corte Masculino',
  'Corte Feminino',
  'Barba',
  'Coloração',
  'Relaxamento',
];

const FilterModal = ({ visible, onClose, onApply, initialFilters }) => {
  const { applyFilters, currentFilters } = useBarbers();

  const [filters, setFilters] = useState({
    isOpen: currentFilters.isOpen,
    services: currentFilters.services || [],
  });

  const toggleService = (service) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleApply = () => {
    applyFilters({ isOpen: filters.isOpen, services: filters.services });
    onClose();
  };

  const handleClear = () => {
    const defaultFilters = {
      isOpen: undefined,
      services: [],
    };
    setFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.statusContainer}>
                <Text style={styles.label}>Aberto</Text>
                <Switch
                  value={filters.isOpen === true}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, isOpen: value ? true : undefined }))
                  }
                />
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.label}>Fechado</Text>
                <Switch
                  value={filters.isOpen === false}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, isOpen: value ? false : undefined }))
                  }
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Serviços</Text>
              <View style={styles.servicesContainer}>
                {AVAILABLE_SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.serviceButton,
                      filters.services.includes(service) && styles.serviceButtonActive,
                    ]}
                    onPress={() => toggleService(service)}
                  >
                    <Text
                      style={[
                        styles.serviceText,
                        filters.services.includes(service) && styles.serviceTextActive,
                      ]}
                    >
                      {service}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleClear}
            >
              <Text style={styles.resetButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  serviceButtonActive: {
    backgroundColor: '#007AFF',
  },
  serviceText: {
    fontSize: 14,
    color: '#666',
  },
  serviceTextActive: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  resetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default FilterModal; 