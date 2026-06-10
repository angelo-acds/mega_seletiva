<p align="center">
  <img src="./frontend/src/assets/logo.svg" width="180">
</p>

<h1 align="center">
 Sistema de Gestão de Projetos e Alocação de Membros
</h1>

<p align="center">
 Plataforma desenvolvida para a Mega Júnior
</p>


## 📑 Índice

* [📖 Sobre o Projeto](#-sobre-o-projeto)
* [⭐ Principais Diferenciais](#-principais-diferenciais)
* [✨ Funcionalidades](#-funcionalidades)
* [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [🏗️ Arquitetura](#️-arquitetura)
* [📂 Estrutura do Projeto](#-estrutura-do-projeto)
* [⚙️ Como Executar](#️-como-executar)
* [🗄️ Banco de Dados](#️-banco-de-dados)
* [🔌 API Principal](#-api-principal)
* [📸 Interface](#-interface)
* [🔮 Próximos Passos](#-próximos-passos)
* [👨‍💻 Equipe](#-equipe)
* [📄 Licença](#-licença)

---

# 📖 Sobre o Projeto

O **Sistema de Gestão de Projetos e Alocação de Membros** foi desenvolvido para centralizar o gerenciamento interno da Mega Júnior, permitindo o controle de projetos, membros, diretores e equipes de forma simples e organizada.

A plataforma possibilita acompanhar a distribuição de responsabilidades, visualizar equipes alocadas em cada projeto e obter métricas consolidadas através de um dashboard administrativo.

---

# ⭐ Principais Diferenciais

* ✅ Arquitetura Full Stack
* ✅ API REST estruturada por módulos
* ✅ Persistência de dados com PostgreSQL
* ✅ Prisma ORM para gerenciamento do banco
* ✅ Dashboard com métricas consolidadas
* ✅ Sistema de autenticação para diretores
* ✅ Interface moderna desenvolvida em React
* ✅ Gerenciamento completo de membros, diretores e projetos

---

# ✨ Funcionalidades

## 👥 Gestão de Membros

* [x] Cadastro de membros
* [x] Listagem de membros
* [x] Visualização detalhada
* [x] Edição de membros
* [x] Remoção de membros

## 📁 Gestão de Projetos

* [x] Cadastro de projetos
* [x] Listagem de projetos
* [x] Visualização detalhada
* [x] Edição de projetos
* [x] Remoção de projetos

## 👨‍💼 Gestão de Diretores

* [x] Cadastro de diretores
* [x] Listagem de diretores
* [x] Visualização detalhada
* [x] Edição de diretores
* [x] Remoção de diretores
* [x] Login administrativo

## 🔗 Sistema de Alocação

* [x] Vinculação de membros a projetos
* [x] Vinculação de diretores a projetos
* [x] Definição de função dentro do projeto
* [x] Remoção de alocações
* [x] Visualização das equipes organizadas por função

## 📊 Dashboard

* [x] Quantidade de projetos por status
* [x] Quantidade total de membros
* [x] Quantidade de membros alocados
* [x] Resumo geral dos projetos

---

# 🛠️ Tecnologias Utilizadas

### Front-end

* React
* Vite
* JavaScript
* CSS
* HTML
* React Router DOM

### Back-end

* Node.js
* Express
* Prisma ORM
* bcrypt
* CORS

### Banco de Dados

* PostgreSQL
* SupaBase

---

# 🏗️ Arquitetura

```text
┌─────────────────────┐
│      Frontend       │
│   React + Vite      │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│      API REST       │
│  Node.js + Express  │
└──────────┬──────────┘
           │ Prisma ORM
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│      Database       │
└─────────────────────┘
```

---

# 📂 Estrutura do Projeto

```bash
mega_seletiva/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── routes/
│   │   └── models/
│   └── vite.config.js
│
├── backend/
│   ├── index.js
│   ├── modules/
│   ├── prisma/
│   └── src/
│       ├── database/
│       ├── models/
│       └── routes/
│
└── README.md
```

---

# ⚙️ Como Executar

## Pré-requisitos

* Node.js
* npm
* PostgreSQL

## 1️⃣ Instalar Dependências

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

---

## 2️⃣ Configurar Variáveis de Ambiente

Backend (`.env`):

```env
DATABASE_URL="sua_url_do_banco"
DIRECT_URL="sua_url_direta_do_banco"
PORT=8080
```

Frontend (`.env`):

```env
VITE_API_URL="http://localhost:8080"
```

---

## 3️⃣ Preparar o Banco

```bash
cd backend

npx prisma generate
npx prisma migrate dev
```

---

## 4️⃣ Iniciar a Aplicação

Backend:

```bash
npm run start:dev
```

Frontend:

```bash
npm run dev
```

---
# 🔌 API Principal

## 🔐 Autenticação

| Método | Endpoint           |
| ------ | ------------------ |
| POST   | `/diretores/login` |

---

## 👨‍💼 Diretores

| Método | Endpoint         |
| ------ | ---------------- |
| GET    | `/diretores`     |
| GET    | `/diretores/:id` |
| POST   | `/diretores`     |
| PUT    | `/diretores/:id` |
| DELETE | `/diretores/:id` |

---

## 👥 Membros

| Método | Endpoint       |
| ------ | -------------- |
| GET    | `/membros`     |
| GET    | `/membros/:id` |
| POST   | `/membros`     |
| PUT    | `/membros/:id` |
| DELETE | `/membros/:id` |

---

## 📁 Projetos

| Método | Endpoint                                |
| ------ | --------------------------------------- |
| GET    | `/projetos`                             |
| GET    | `/projetos/:id`                         |
| POST   | `/projetos`                             |
| PUT    | `/projetos/:id`                         |
| DELETE | `/projetos/:id`                         |
| POST   | `/projetos/:id/alocar`                  |
| DELETE | `/projetos/:projetoId/alocar/:membroId` |
| DELETE | `/projetos/desalocar/:alocacaoId`       |

---

## 📊 Dashboard

| Método | Endpoint     |
| ------ | ------------ |
| GET    | `/dashboard` |

---
# 🔮 Próximos Passos

* [ ] Melhorar autenticação e controle de sessão
* [ ] Implementar permissões por perfil
* [ ] Expandir dashboard com novos indicadores
* [ ] Adicionar histórico de alterações
* [ ] Criar relatórios exportáveis
* [ ] Implementar testes automatizados
* [ ] Dockerização da aplicação

---

# 👨‍💻 Equipe

| Desenvolvedor | GitHub |
|---------------|---------|
| Angelo Antonio Correa de Souza | [GitHub](https://github.com/angelo-acds)       |
| Vinicios Rodrigues da Silva Cardoso | [GitHub](github.com/vr0107073-max) |
| Jhonathan Souza Soares | [GitHub](github.com/Gugs235) |


---

# 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do Processo Seletivo da Mega Júnior.

O código-fonte pode ser utilizado como referência para estudos e aprendizado.
