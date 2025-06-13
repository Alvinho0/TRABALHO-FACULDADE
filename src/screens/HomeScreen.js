// src/screens/HomeScreen.js
// Esta tela é a principal do aplicativo, exibindo a lista de cabeleireiros.
// Ela utiliza o contexto de barbeiros para obter a lista filtrada e os estados de carregamento/erro.
// Inclui uma barra de pesquisa e um botão para abrir o modal de filtros.

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBarbers } from '../context/BarbersContext';
import SearchBar from '../components/SearchBar';
import BarberCard from '../components/BarberCard';
import FilterModal from '../components/FilterModal';

const HomeScreen = ({ navigation }) => {
  // Estado local para controlar a visibilidade do modal de filtros.
  const [showFilters, setShowFilters] = useState(false);

  // Obtém a lista de cabeleireiros, estados de carregamento e erro do contexto.
  const {
    barbers, // Agora é a lista já filtrada/buscada
    loading,
    error,
    setSearchNameAndRegion,
    applyFilters,
    resetSearchAndFilters,
    currentSearchName,
    currentSearchRegion,
    currentFilters,
  } = useBarbers();

  // A função handleSearch recebe os valores dos inputs do SearchBar
  const handleSearch = useCallback((name, region) => {
    // Chama a função do contexto com os valores recebidos do SearchBar
    setSearchNameAndRegion(name, region);
  }, [setSearchNameAndRegion]); // Depende da função do contexto

  // A função handleClear agora apenas chama a função de reset no contexto
  const handleClear = useCallback(() => {
    resetSearchAndFilters(); // Reseta busca e filtros no contexto
  }, [resetSearchAndFilters]); // Depende da função do contexto

  // Funções para aplicar filtros do modal (chama a função do contexto)
  const handleApplyFilter = useCallback((filters) => {
    applyFilters(filters);
  }, [applyFilters]); // Depende da função do contexto

  // Função para abrir o modal de filtros.
  const openFilterModal = () => {
    setShowFilters(true);
  };

  // Função para fechar o modal de filtros.
  const closeFilterModal = () => {
    setShowFilters(false);
  };

  // Renderiza a tela principal.
  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      <View style={styles.searchBarContainer}> {/* Container para alinhar SearchBar e botão de filtro */}
        <SearchBar
          initialSearchName={currentSearchName}
          initialSearchRegion={currentSearchRegion}
          onClear={handleClear}
          onSearch={handleSearch}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}
        >
          <Ionicons name="options" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : error ? (
        // Mensagem de erro
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        // Lista de cabeleireiros
        <FlatList
          data={barbers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BarberCard
              barber={item}
              onPress={() => navigation.navigate('BarberDetails', { barber: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>Nenhum cabeleireiro encontrado.</Text>
            </View>
          )}
        />
      )}

      {/* Modal de filtros */}
      <FilterModal
        visible={showFilters}
        onClose={closeFilterModal}
        onApply={handleApplyFilter}
        initialFilters={currentFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchBarContainer: { // Novo estilo para o container da SearchBar e botão de filtro
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16, // Adiciona padding à direita para o botão de filtro
    backgroundColor: 'white', // Fundo branco para a área de busca
  },
  filterButton: {
    padding: 8,
    // Ajuste margem ou padding se necessário para alinhamento com a SearchBar
  },
  listContent: {
    paddingBottom: 16,
    // Adiciona padding no topo para que o primeiro item não fique colado na SearchBar
    paddingTop: 8, // Ajuste conforme a altura da SearchBar
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
  emptyList: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen; 