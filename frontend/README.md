# Mega Jr. — Sistema de Gestão de Projetos e Alocação de Membros

Frontend React do sistema desenvolvido para o Process Seletivo Mega Jr. 2026.

## Tecnologias

- **React 18** + **Vite**
- **React Router DOM v6** — roteamento
- **Axios** — chamadas HTTP
- **React Icons** — ícones (Tabler Icons)
- **CSS puro com variáveis** — fiel ao design system do Figma

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação e execução

```bash
# 1. Entre na pasta do frontend
cd mega-jr-frontend

# 2. Instale as dependências
npm install

# 3. Configure a URL da API (opcional)
# Crie um arquivo .env na raiz:
echo "VITE_API_URL=http://localhost:3333" > .env

# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Build para produção

```bash
npm run build
npm run preview
```

## Estrutura de pastas

```
src/
├── components/        # Componentes reutilizáveis
│   ├── Sidebar.jsx    # Menu lateral
│   └── PageLayout.jsx # Wrapper com sidebar + main
├── pages/             # Telas da aplicação
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Projetos.jsx
│   ├── ProjetoDetalhes.jsx
│   ├── CadastroProjeto.jsx
│   ├── Membros.jsx
│   ├── MembroDetalhes.jsx
│   ├── CadastroMembro.jsx
│   ├── Admin.jsx
│   └── CadastroAdmin.jsx
├── services/
│   └── api.js         # Camada de serviços HTTP (Axios)
├── App.jsx            # Configuração de rotas
├── main.jsx           # Entry point
└── index.css          # Variáveis globais e reset
```

## Integração com o Backend

Todas as chamadas HTTP estão centralizadas em `src/services/api.js`.
Os dados mock estão comentados com `// TODO: integrar com o backend real`.

Para integrar, basta descomentar as chamadas reais e remover os dados mock em cada página.

## Design

Design no Figma:  
https://www.figma.com/design/hhw8rCdaa7bh9lEeqYSppP/Proj.-Mega-Jr.---Sist.-de-Gest.-de-Proj.-e-Aloc.-de-Memb.

### Paleta de cores (CSS Variables)

| Variável             | Valor     | Uso                   |
|----------------------|-----------|-----------------------|
| `--roxo-profundo`    | `#1A1A2E` | Background principal  |
| `--roxo-principal`   | `#5B21B6` | Inputs e destaques    |
| `--roxo-botao`       | `#784BFF` | Botões primários      |
| `--roxo-claro`       | `#A78BFA` | Itens ativos no menu  |
| `--preto-card`       | `#111111` | Cards e tabelas       |
| `--cinza-sidebar`    | `#4B5563` | Sidebar               |
