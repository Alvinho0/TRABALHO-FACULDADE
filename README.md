# CabelereiroApp

Um aplicativo React Native para encontrar cabeleireiros próximos a você.

## Funcionalidades

- Lista de cabeleireiros com informações detalhadas
- Visualização em mapa com localização dos cabeleireiros
- Pesquisa por nome ou endereço
- Filtros por status (aberto/fechado), avaliação e serviços
- Detalhes completos do cabeleireiro
- Integração com mapas para navegação
- Chamada direta para o cabeleireiro

## Requisitos

- Node.js (versão LTS)
- npm ou Yarn
- React Native CLI
- Expo CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS, apenas macOS)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd CabelereiroApp
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o aplicativo:
```bash
npm start
# ou
yarn start
```

## Estrutura do Projeto

```
src/
  ├── assets/         # Imagens e recursos estáticos
  ├── components/     # Componentes reutilizáveis
  ├── context/        # Contextos React para gerenciamento de estado
  ├── navigation/     # Configuração de navegação
  ├── screens/        # Telas do aplicativo
  ├── services/       # Serviços e APIs
  ├── utils/          # Funções utilitárias
  ├── constants/      # Constantes e configurações
  └── data/          # Dados mockados (MVP)
```

## Tecnologias Utilizadas

- React Native
- React Navigation
- React Native Maps
- Expo Location
- Context API para gerenciamento de estado

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 