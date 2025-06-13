// src/context/BarbersContext.js
// Este Contexto é responsável por gerenciar o estado global da lista de cabeleireiros.
// Ele carrega os dados, aplica a lógica de busca (por nome e endereço) e os filtros,
// e disponibiliza a lista resultante (já filtrada) e as funções para as telas e componentes.

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
// Importamos a função de serviço para obter os dados dos cabeleireiros (atualmente do JSON local).
import { getBarbers } from '../services/barbersService';

// Criamos o contexto. Ele vai segurar o estado e as funções que compartilharemos.
const BarbersContext = createContext();

// Este é o provedor do contexto. Ele "embrulha" a parte do seu aplicativo
// que precisa ter acesso aos dados dos cabeleireiros.
export const BarbersProvider = ({ children }) => {
  // Estado que guarda a lista COMPLETA de todos os cabeleireiros carregados do JSON.
  const [allBarbers, setAllBarbers] = useState([]);
  // Estado para indicar se os dados estão sendo carregados (mostra um indicador visual).
  const [loading, setLoading] = useState(true);
  // Estado para guardar mensagens de erro, caso algo dê errado ao carregar os dados.
  const [error, setError] = useState(null);

  // Estados para guardar os termos que o usuário digitou nos campos de busca.
  const [searchName, setSearchName] = useState(''); // Termo do campo 'Buscar cabeleireiros...'
  const [searchRegion, setSearchRegion] = useState(''); // Termo do campo 'Endereço, bairro ou cidade...'

  // Estado para guardar os filtros selecionados no modal (ex: Apenas abertos, Avaliação mínima, Serviços).
  const [activeFilters, setActiveFilters] = useState({
    isOpen: undefined, // Pode ser true, false ou undefined (ignorar filtro)
    minRating: 0, // Avaliação mínima (0 a 5)
    services: [], // Lista de serviços selecionados
  });

  // Função assíncrona para carregar todos os dados dos cabeleireiros do serviço (JSON local).
  const loadAllBarbers = async () => {
    try {
      setLoading(true); // Ativa o indicador de carregamento
      const data = await getBarbers(); // Espera os dados do serviço
      setAllBarbers(data); // Armazena os dados na lista completa
      setError(null); // Limpa qualquer erro anterior
    } catch (error) {
      // Se der erro ao carregar, registra no console e no estado de erro.
      console.error('Erro ao carregar todos os dados dos cabeleireiros:', error);
      setError('Erro ao carregar dados dos cabeleireiros locais.');
      setAllBarbers([]); // Limpa a lista em caso de erro
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  // useEffect é usado para executar algo quando o componente é montado ou quando suas dependências mudam.
  // Aqui, carregamos todos os barbeiros UMA VEZ quando o provedor é montado ([] como dependência).
  useEffect(() => {
    loadAllBarbers();
  }, []); // O array vazio significa que este efeito roda apenas uma vez, ao montar.

  // useMemo é uma função que só recalcula seu valor quando suas dependências mudam.
  // Usamos para criar a lista FINAL exibida (barbeiros filtrados/buscados).
  // Ela recalcula a lista sempre que allBarbers, searchName, searchRegion ou activeFilters mudam.
  const filteredBarbers = useMemo(() => {
    // Começamos com uma cópia da lista completa.
    let filtered = [...allBarbers];

    // --- Aplicar Lógica de Busca (Nome e Endereço/Região) ---

    // Aplicar busca por nome: filtra a lista se o termo do nome estiver presente
    const nameTerm = searchName.trim().toLowerCase();
    if (nameTerm) {
      filtered = filtered.filter(barber =>
        barber.name.toLowerCase().includes(nameTerm)
      );
    }

    // Aplicar busca por endereço/região: filtra a lista se o termo da região estiver presente
    const regionTerm = searchRegion.trim().toLowerCase();
    if (regionTerm) {
        filtered = filtered.filter(barber =>
            barber.address.toLowerCase().includes(regionTerm)
        );
    }

    // --- Aplicar Lógica de Filtros (Modal) ---

    // Filtro por status de abertura: se isOpen for true ou false, filtra a lista.
    if (activeFilters.isOpen !== undefined) {
      filtered = filtered.filter(barber => barber.isOpen === activeFilters.isOpen);
    }

    // Filtro por avaliação mínima: se minRating for maior que 0, filtra pela avaliação.
    if (activeFilters.minRating) {
      filtered = filtered.filter(barber => barber.rating >= activeFilters.minRating);
    }

    // Filtro por serviços: se houver serviços selecionados, filtra se o barbeiro oferecer ALGUM deles.
    if (activeFilters.services && activeFilters.services.length > 0) {
      filtered = filtered.filter(barber =>
        activeFilters.services.some(service => barber.services.includes(service))
      );
    }

    // Retorna a lista final após aplicar todas as buscas e filtros.
    return filtered;
  }, [allBarbers, searchName, searchRegion, activeFilters]); // Dependências: recalcula se qualquer um desses mudar.

  // --- Funções que a tela (ou outros componentes) podem chamar para interagir com o estado ---

  // Função para definir os termos de busca (nome e região). Usada pelo SearchBar.
  const setSearchNameAndRegion = (name, region) => {
    setSearchName(name);
    setSearchRegion(region);
    // O useMemo acima vai detectar a mudança e recalcular a lista filteredBarbers.
  };

  // Função para aplicar os filtros selecionados no modal. Usada pelo FilterModal.
  const applyFilters = (filters) => {
    setActiveFilters(filters);
    // O useMemo acima vai detectar a mudança e recalcular a lista filteredBarbers.
  };

  // Função para limpar todos os termos de busca e filtros ativos.
  const resetSearchAndFilters = () => {
    setSearchName(''); // Limpa o termo de busca por nome
    setSearchRegion(''); // Limpa o termo de busca por região
    setActiveFilters({
      // Reseta os filtros para o estado inicial
      isOpen: undefined,
      minRating: 0,
      services: [],
    });
    // O useMemo acima vai detectar as mudanças e recalcular a lista filteredBarbers (voltando à lista completa).
  };

  // Função para permitir que a tela recarregue os dados do JSON local manualmente (se necessário).
  const refreshBarbers = () => {
    loadAllBarbers();
  };

  // --- O valor que o contexto disponibiliza para quem o utiliza ---

  return (
    <BarbersContext.Provider
      value={{
        // A lista de cabeleireiros (já filtrada/buscada)
        barbers: filteredBarbers,
        // Estado de carregamento
        loading,
        // Mensagem de erro
        error,
        // Função para definir os termos de busca (usada pelo SearchBar)
        setSearchNameAndRegion,
        // Função para aplicar filtros (usada pelo FilterModal)
        applyFilters,
        // Função para limpar busca e filtros (usada pelo botão de limpar do SearchBar ou outro local)
        resetSearchAndFilters,
        // Função para recarregar os dados manualmente
        refreshBarbers,
        // Expor os termos de busca e filtros atuais (útil para inicializar o SearchBar/FilterModal)
        currentSearchName: searchName,
        currentSearchRegion: searchRegion,
        currentFilters: activeFilters,
      }}
    >
      {/* Renderiza os componentes filhos que estão dentro do provedor */}
      {children}
    </BarbersContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto em qualquer componente.
// Em vez de `useContext(BarbersContext)`, você usa `useBarbers()`. Mais limpo!
export const useBarbers = () => {
  const context = useContext(BarbersContext);
  // Se alguém usar o hook FORA do provedor, disparamos um erro claro.
  if (!context) {
    throw new Error('useBarbers deve ser usado dentro de um BarbersProvider');
  }
  return context;
}; 