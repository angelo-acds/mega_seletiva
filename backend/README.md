# ⚙️ Backend - Sistema de Gestão de Projetos e Alocação de Membros

API REST responsável pelo gerenciamento de membros, diretores, projetos e alocações do Sistema de Gestão de Projetos da Mega Júnior.

---

## 📋 Índice

* [📖 Sobre a API](#-sobre-a-api)
* [✨ Funcionalidades](#-funcionalidades)
* [🛠 Tecnologias](#-tecnologias)
* [🏗 Arquitetura](#-arquitetura)
* [📂 Estrutura do Projeto](#-estrutura-do-projeto)
* [⚙️ Como Executar](#️-como-executar)
* [📜 Scripts Disponíveis](#-scripts-disponíveis)
* [🔌 Rotas da API](#-rotas-da-api)
* [📏 Regras de Negócio](#-regras-de-negócio)
* [🗄 Modelo de Dados](#-modelo-de-dados)
* [💡 Exemplos de Uso](#-exemplos-de-uso)
* [📊 Respostas da API](#-respostas-da-api)

---

# 📖 Sobre a API

Esta API foi desenvolvida utilizando **Node.js**, **Express** e **Prisma ORM**, tendo o **PostgreSQL** como banco de dados principal.

Ela fornece todos os recursos necessários para:

* Autenticação de diretores;
* Gerenciamento de membros;
* Gerenciamento de projetos;
* Controle de alocações;
* Geração de métricas para dashboards;
* Relacionamento entre equipes e projetos.

---

# ✨ Funcionalidades

## 👥 Membros

* [x] Cadastro
* [x] Listagem
* [x] Consulta individual
* [x] Atualização
* [x] Remoção

## 👨‍💼 Diretores

* [x] Cadastro
* [x] Login
* [x] Atualização
* [x] Remoção

## 📁 Projetos

* [x] Cadastro
* [x] Listagem
* [x] Atualização
* [x] Remoção
* [x] Controle de status

## 🔗 Alocações

* [x] Vinculação de membros
* [x] Vinculação de diretores
* [x] Definição de função no projeto
* [x] Desalocação

## 📊 Dashboard

* [x] Total de membros
* [x] Total de membros alocados
* [x] Total de membros disponíveis
* [x] Projetos por status

---

# 🛠 Tecnologias

| Tecnologia | Finalidade                  |
| ---------- | --------------------------- |
| Node.js    | Runtime JavaScript          |
| Express    | API REST                    |
| Prisma ORM | Persistência de dados       |
| PostgreSQL | Banco de dados              |
| bcrypt     | Criptografia de senhas      |
| cors       | Integração frontend/backend |
| dotenv     | Variáveis de ambiente       |
| nodemon    | Ambiente de desenvolvimento |

---

# 🏗 Arquitetura

```text
Frontend (React)
        │
        ▼
API REST (Express)
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL
```

---

# 📂 Estrutura do Projeto

```bash
backend/
├── index.js
├── modules/
│   └── express.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── database/
│   │   └── connect.js
│   │
│   ├── models/
│   │   ├── dashboardModel.js
│   │   ├── diretorModel.js
│   │   ├── membroModel.js
│   │   └── projetoModel.js
│   │
│   └── routes/
│       ├── dashboardRoutes.js
│       ├── diretorRoutes.js
│       ├── membroRoutes.js
│       └── projetoRoutes.js
│
├── package.json
└── prisma.config.ts
```

---

# ⚙️ Como Executar

## Pré-requisitos

* Node.js 18+
* npm
* PostgreSQL

---

## Instalar Dependências

```bash
npm install
```

---

## Configurar Variáveis de Ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
DIRECT_URL="postgresql://usuario:senha@host:5432/banco"
PORT=8080
```

---

## Preparar Banco de Dados

```bash
npx prisma generate

npx prisma migrate dev
```

---

## Executar Aplicação

```bash
npm run start:dev
```

Servidor disponível em:

```text
http://localhost:8080
```

---

# 📜 Scripts Disponíveis

| Script            | Descrição                                |
| ----------------- | ---------------------------------------- |
| npm run start:dev | Inicializa o servidor utilizando Nodemon |

---

# 🔌 Rotas da API

## 🔐 Autenticação

| Método | Endpoint         |
| ------ | ---------------- |
| POST   | /diretores/login |

---

## 👨‍💼 Diretores

| Método | Endpoint       |
| ------ | -------------- |
| GET    | /diretores     |
| GET    | /diretores/:id |
| POST   | /diretores     |
| PUT    | /diretores/:id |
| DELETE | /diretores/:id |

---

## 👥 Membros

| Método | Endpoint     |
| ------ | ------------ |
| GET    | /membros     |
| GET    | /membros/:id |
| POST   | /membros     |
| PUT    | /membros/:id |
| DELETE | /membros/:id |

---

## 📁 Projetos

| Método | Endpoint                              |
| ------ | ------------------------------------- |
| GET    | /projetos                             |
| GET    | /projetos/:id                         |
| POST   | /projetos                             |
| PUT    | /projetos/:id                         |
| DELETE | /projetos/:id                         |
| POST   | /projetos/:id/alocar                  |
| DELETE | /projetos/:projetoId/alocar/:membroId |
| DELETE | /projetos/desalocar/:alocacaoId       |

---

## 📊 Dashboard

| Método | Endpoint   |
| ------ | ---------- |
| GET    | /dashboard |

---

# 📏 Regras de Negócio

## Membros

* Nome obrigatório;
* RGA obrigatório com 12 dígitos;
* E-mail válido;
* Pelo menos uma função cadastrada.

## Diretores

* Senha criptografada utilizando bcrypt;
* Login validado no banco;
* Retorno sem exposição da senha.

## Projetos

* Nome obrigatório;
* Status inicial: `Criado`;
* Possibilidade de alocar membros durante a criação.

## Alocações

* Controle de vínculos através da tabela intermediária `Alocacao`;
* Restrição para evitar duplicidade de relacionamentos.

---

# 🗄 Modelo de Dados

## Entidades Principais

### Membro

```text
id
name
email
rga
funcoes
createdAt
```

### Projeto

```text
id
nome
descricao
status
dataLimite
createdAt
```

### Diretor

```text
id
nome
rga
email
login
senha
funcoes
createdAt
```

### Alocação

```text
id
membroId
diretorId
projetoId
funcaoNoProjeto
createdAt
```

---

# 💡 Exemplos de Uso

## Criar Membro

```json
{
  "nome": "Maria Silva",
  "rga": "123456789012",
  "email": "maria@empresa.com",
  "stacks": ["Front-End", "Designer"]
}
```

---

## Criar Projeto

```json
{
  "nome": "Portal Interno",
  "descricao": "Sistema de organização da equipe",
  "status": "Criado",
  "dataLimite": "2026-12-31"
}
```

---

## Login de Diretor

```json
{
  "login": "admin",
  "senha": "123456"
}
```

---

# 📊 Respostas da API

## Dashboard

Retorna:

* Projetos por status;
* Total de membros cadastrados;
* Total de membros alocados;
* Total de membros disponíveis;
* Lista resumida de projetos.

## Listagem de Membros

Retorna:

* Dados básicos;
* Funções cadastradas;
* Quantidade de projetos vinculados.

## Listagem de Projetos

Retorna:

* Nome;
* Status;
* Data limite;
* Quantidade de membros alocados.

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do Processo Seletivo da Mega Júnior.
