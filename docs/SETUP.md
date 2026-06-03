# 🔧 Guia de Setup

Instruções detalhadas para configurar o ambiente de desenvolvimento local.

## Pré-requisitos

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 7+ (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/)) - Para o banco de dados

## Instalação Completa

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/angelo-acds/mega_seletiva.git
cd mega_seletiva
```

### 2️⃣ Setup do Backend

#### Instale as Dependências
```bash
cd backend
npm install
```

#### Configure o Banco de Dados

1. **Crie um arquivo `.env`** baseado em `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env`** com suas credenciais:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/mega_seletiva"
   PORT=3000
   JWT_SECRET="sua_chave_secreta_muito_segura"
   CORS_ORIGIN="http://localhost:5173"
   NODE_ENV="development"
   ```

3. **Crie o banco de dados no PostgreSQL**:
   ```bash
   createdb mega_seletiva
   ```

4. **Execute as migrações do Prisma**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Visualize o banco (opcional)**:
   ```bash
   npx prisma studio
   ```
   - Abrirá em `http://localhost:5555`

#### Inicie o Backend
```bash
npm run start:dev
```
- Servidor rodará em `http://localhost:3000`
- Use [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para testar os endpoints

---

### 3️⃣ Setup do Frontend

#### Instale as Dependências
```bash
cd ../frontend
npm install
```

#### Configure as Variáveis de Ambiente

1. **Crie um arquivo `.env`** baseado em `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. **Edite o arquivo `.env`** (se necessário):
   ```
   VITE_API_URL="http://localhost:3000"
   VITE_APP_ENV="development"
   ```

#### Inicie o Frontend
```bash
npm run dev
```
- Frontend rodará em `http://localhost:5173`

---

## ✅ Verificação

Se tudo funcionou:
- ✅ Backend rodando em `http://localhost:3000`
- ✅ Frontend rodando em `http://localhost:5173`
- ✅ Banco de dados PostgreSQL conectado
- ✅ Você consegue acessar o Prisma Studio em `http://localhost:5555`

---

## 🐛 Troubleshooting

### Erro: `EADDRINUSE: address already in use :::3000`
Porta 3000 já está em uso. Altere a porta no `.env`:
```
PORT=3001
```

### Erro: `database "mega_seletiva" already exists`
O banco já existe. Você pode:
- Deletar e recriar: `dropdb mega_seletiva && createdb mega_seletiva`
- Ou usar outro nome no `DATABASE_URL`

### Erro: `connect ECONNREFUSED`
PostgreSQL não está rodando. Inicie o serviço:
```bash
# macOS (Homebrew)
brew services start postgresql

# Windows (Command Prompt como admin)
net start PostgreSQL

# Linux
sudo service postgresql start
```

### Erro: `Cannot find module 'express'`
Você esqueceu de rodar `npm install`. Execute:
```bash
npm install
```

---

## 🔄 Atualizando o Repositório

Para puxar as últimas mudanças:
```bash
git pull origin main
npm install  # Se houver novos pacotes
```

---

## 📝 Padrões de Desenvolvimento

### Commits
Use o formato:
```
feat: adicionar nova feature
fix: corrigir bug
docs: atualizar documentação
style: melhorias de formatação
refactor: refatorar código
```

### Branch Names
```
feature/nome-da-feature
bugfix/nome-do-bug
docs/nome-da-doc
```

---

## 📞 Precisa de Ajuda?

Consulte:
- [API.md](API.md) - Documentação dos endpoints
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guia de contribuição
- [README.md](../README.md) - Visão geral do projeto

