// src/components/SearchBar.js
// Este componente exibe uma barra de pesquisa que permite ao usuário buscar cabeleireiros por nome e endereço/região.
// Ele utiliza o contexto de barbeiros para atualizar os termos de busca e, assim, filtrar a lista de cabeleireiros.

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Importa o hook useBarbers para acessar as funções e estados do contexto de barbeiros.
import { useBarbers } from '../context/BarbersContext';

// Usando forwardRef para permitir que o componente pai acesse métodos internos se necessário
// Embora não usemos métodos imperativos para este problema, é uma boa prática com forwardRef
const SearchBar = forwardRef(({
  initialSearchName = '',
  initialSearchRegion = '',
  onClear, // Recebe a função onClear do pai
  onSearch, // Recebe a função onSearch do pai, que receberá (name, region)
}, ref) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchName);
  const [regionQuery, setRegionQuery] = useState(initialSearchRegion);

  // Usar um ref para controlar se já definimos o estado inicial a partir das props
  const isInitialRender = React.useRef(true);

  // Obtém as funções e estados do contexto de barbeiros.
  const { setSearchNameAndRegion, resetSearchAndFilters } = useBarbers();

  // Efeito para sincronizar o estado interno APENAS na montagem ou quando o reset global ocorrer
  useEffect(() => {
    if (isInitialRender.current) {
      setSearchQuery(initialSearchName);
      setRegionQuery(initialSearchRegion);
      isInitialRender.current = false;
    } else if (searchQuery !== initialSearchName || regionQuery !== initialSearchRegion) {
       // Se as props iniciais mudarem (ex: reset global), atualiza o estado interno apenas se diferente
       // Isso tenta evitar sobrescrever o que o usuário está digitando
       // Uma forma mais segura seria resetar explicitamente via ref no onClear handler do pai
       if (searchQuery !== initialSearchName) setSearchQuery(initialSearchName);
       if (regionQuery !== initialSearchRegion) setRegionQuery(initialSearchRegion);
    }
  }, [initialSearchName, initialSearchRegion]);

  // Handlers internos que apenas atualizam o estado local
  const handleNameChange = (text) => {
    setSearchQuery(text);
    // Não notifica o pai sobre CADA mudança de texto, apenas na busca/limpar.
    // Isso pode reduzir re-renderizações desnecessárias no pai enquanto digita.
  };

  const handleRegionChangeInternal = (text) => {
    setRegionQuery(text);
    // Não notifica o pai sobre CADA mudança de texto.
  };

  const handleClearInternal = () => {
    setSearchQuery('');
    setRegionQuery('');
    // Chama a função de limpar do pai para resetar o estado global do contexto
    if (onClear) onClear();
    resetSearchAndFilters();
  };

  const handleSearchInternal = () => {
    // Dispara a busca no pai com os valores ATUAIS dos estados internos
    if (onSearch) onSearch(searchQuery, regionQuery);
  };

  // Expor funções internas via ref (opcional, mas demonstra uso de forwardRef)
  useImperativeHandle(ref, () => ({
    // Exemplo: resetar inputs externamente se necessário
    resetInputs: () => {
      setSearchQuery(initialSearchName);
      setRegionQuery(initialSearchRegion);
    }
  }));

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar cabeleireiros..."
          value={searchQuery} // Controlado pelo estado interno
          onChangeText={handleNameChange} // Atualiza estado interno
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={handleSearchInternal} // Dispara busca no Enter
          autoCorrect={false} // Pode ajudar a evitar interrupções do teclado
          autoCapitalize="none" // Pode ajudar a evitar interrupções do teclado
          spellCheck={false} // Pode ajudar a evitar interrupções do teclado
        />
        {searchQuery || regionQuery ? (
          <TouchableOpacity onPress={handleClearInternal} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleSearchInternal} style={styles.searchButton}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.regionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Endereço, bairro ou cidade..."
          value={regionQuery} // Controlado pelo estado interno
          onChangeText={handleRegionChangeInternal} // Atualiza estado interno
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={handleSearchInternal} // Dispara busca no Enter
          autoCorrect={false} // Pode ajudar a evitar interrupções do teclado
          autoCapitalize="none" // Pode ajudar a evitar interrupções do teclado
          spellCheck={false} // Pode ajudar a evitar interrupções do teclado
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 8,
  },
  regionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchButton: {
    padding: 4,
    marginLeft: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchBar; 