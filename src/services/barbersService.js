// src/services/barbersService.js
// Este arquivo lida com a obtenção de dados dos cabeleireiros.
// Atualmente, ele carrega os dados diretamente do arquivo JSON local (dados mockados).
// Em um aplicativo real, as funções aqui fariam chamadas para uma API RESTful externa.

import barbersData from '../data/barbers.json';

// Função assíncrona para obter a lista completa de cabeleireiros.
// `async` indica que esta função pode esperar por operações demoradas (como uma chamada de API).
export async function getBarbers() {
  // Simulamos um pequeno atraso para que você possa ver o indicador de carregamento (loading).
  // Isso imita o tempo que levaria para buscar dados pela internet.
  await new Promise(resolve => setTimeout(resolve, 300));

  // Retorna os dados lidos do arquivo JSON local.
  return barbersData;
}

// Esta função foi criada para uma tentativa anterior de buscar por região via API,
// mas agora é usada apenas para compatibilidade. A lógica principal de filtro combinado
// por nome e endereço/região está no Contexto dos Barbeiros (BarbersContext.js).
export async function getBarbersByRegion(region) {
   console.warn('getBarbersByRegion chamada, mas o filtro combinado é feito em outro lugar.');
   // Filtro simples local por endereço no conjunto de dados completo (fallback).
   const regiao = region.trim().toLowerCase();
   return barbersData.filter(barber => barber.address.toLowerCase().includes(regiao));
}

// A função searchBarbersNearby e a constante GOOGLE_PLACES_API_KEY foram removidas
// pois voltamos a usar apenas os dados locais por enquanto. 