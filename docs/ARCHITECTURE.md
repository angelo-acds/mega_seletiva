# 🏗️ Arquitetura do Projeto

Visão geral da arquitetura e organização do projeto fullstack.

---

## Visão Geral

```
mega_seletiva (Monorepo)
│
├── backend/        (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── routes/      # Rotas da API
│   │   ├── models/      # Modelos/Controllers
│   │   ├── database/    # Conexão e queries
│   │   └── modules/     # Módulos reutilizáveis
│   ├── prisma/          # Schemas ORM
│   ├── index.js         # Entry point
│   └── package.json
│
├── frontend/       (React + Vite)
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas (rotas)
│   │   ├── services/    # Axios & API calls
│   │   ├── routes/      # Roteamento (React Router)
│   │   ├── models/      # Types/Interfaces
│   │   ├── assets/      # Imagens, fontes
│   │   ├── App.jsx      # Componente root
│   │   └── main.jsx     # Entry point
│   ├── vite.config.js
│   └── package.json
│
└── docs/           (Documentação)
    ├── SETUP.md
    ├── API.md
    └── ARCHITECTURE.md (este arquivo)
```

---

## Backend

### Stack Tecnológico
- **Express.js** - Framework HTTP
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Bcrypt** - Hash de senhas
- **CORS** - Permitir requisições cross-origin

### Estrutura de Pastas

```
backend/
├── src/
│   ├── routes/          # Definições de rotas
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── index.js
│   │
│   ├── models/          # Controllers/Business Logic
│   │   ├── AuthModel.js
│   │   ├── UserModel.js
│   │   └── index.js
│   │
│   ├── database/        # Queries customizadas
│   │   ├── queries.js
│   │   └── connection.js
│   │
│   └── modules/         # Código reutilizável
│       ├── auth.js
│       ├── validation.js
│       └── utils.js
│
├── prisma/
│   ├── schema.prisma    # Modelo do banco
│   └── migrations/      # Histórico de mudanças
│
├── index.js             # Arquivo principal
├── package.json
└── .env
```

### Fluxo de Requisição

```
Cliente HTTP
    ↓
Express Router (src/routes/)
    ↓
Controller/Model (src/models/)
    ↓
Database Query (Prisma ORM)
    ↓
PostgreSQL Database
    ↓
Response JSON
```

### Exemplo: Registrar Usuário

1. **POST /auth/register** → `src/routes/auth.js`
2. Chama `AuthModel.register()` → `src/models/AuthModel.js`
3. Valida dados → `src/modules/validation.js`
4. Hash senha com bcrypt → `src/modules/auth.js`
5. Salva no banco → Prisma → PostgreSQL
6. Retorna JWT token

---

## Frontend

### Stack Tecnológico
- **React 18** - Biblioteca de UI
- **Vite** - Build tool (muito mais rápido que Webpack)
- **React Router v6** - Roteamento
- **Axios** - Client HTTP
- **React Icons** - Ícones

### Estrutura de Pastas

```
frontend/src/
│
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx
│   ├── Navbar.jsx
│   ├── Button.jsx
│   └── Loading.jsx
│
├── pages/              # Páginas (lazy loaded)
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
│
├── routes/             # Configuração de rotas
│   └── index.jsx       # React Router setup
│
├── services/           # Chamadas à API
│   ├── api.js          # Configuração Axios
│   ├── auth.service.js
│   └── users.service.js
│
├── models/             # Types/Interfaces
│   └── types.js
│
├── assets/             # Imagens, fontes, etc
│   └── images/
│
├── App.jsx             # Componente root
├── main.jsx            # Entry point
└── index.css           # Estilos globais
```

### Fluxo de Dados

```
User Click → Component Handler
    ↓
Call API Service (axios)
    ↓
Backend Response
    ↓
Update State (React)
    ↓
Re-render Component
    ↓
Update UI
```

### Exemplo: Fazer Login

1. User clica "Login" → `pages/Login.jsx`
2. Chama `auth.service.login(email, password)`
3. `api.post('/auth/login', { email, password })`
4. Backend retorna token + user data
5. Salva token no `localStorage`
6. Redux/Context atualiza estado
7. Redireciona para `/dashboard`

---

## Comunicação Backend ↔ Frontend

### Requisição (Frontend → Backend)

```javascript
// frontend/src/services/auth.service.js
import axios from 'axios';

const API_URL = process.env.VITE_API_URL;

export const login = async (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};
```

### Resposta (Backend → Frontend)

```json
{
  "id": "123",
  "name": "João",
  "email": "joao@example.com",
  "token": "eyJhbGc..."
}
```

### Headers Importantes

```
Authorization: Bearer TOKEN
Content-Type: application/json
```

---

## Banco de Dados

### Schema (Prisma)

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  password String (hashed)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migrations

```bash
# Criar nova migração
npx prisma migrate dev --name add_users_table

# Listar migrações
npx prisma migrate status

# Resetar banco (CUIDADO!)
npx prisma migrate reset
```

---

## Autenticação

### JWT Flow

```
1. User faz login
2. Backend valida credenciais
3. Backend cria JWT token
4. Frontend recebe token + salva em localStorage
5. Frontend envia token em cada requisição
6. Backend valida token
7. Frontend acessa recurso protegido
```

### Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": 123,
    "email": "joao@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  },
  "signature": "..."
}
```

---

## Deployment

### Backend
```
Enviado para: Heroku, Railway, AWS, DigitalOcean, etc.
```

### Frontend
```
Enviado para: Vercel, Netlify, GitHub Pages, AWS S3, etc.
```

### Banco de Dados
```
PostgreSQL hospedado em: Supabase, Railway, AWS RDS, Heroku, etc.
```

---

## Segurança

- ✅ Senhas hashed com bcrypt
- ✅ JWT tokens com expiração
- ✅ CORS configurado
- ✅ Variáveis sensíveis em `.env`
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: Input validation mais rigorosa
- ⚠️ TODO: HTTPS em produção

---

## Performance

### Frontend
- Lazy loading de rotas
- Code splitting com Vite
- Assets otimizados

### Backend
- Queries otimizadas com Prisma
- Indexação do banco de dados
- Caching (TODO)

---

## Próximos Passos

1. Implementar testes automatizados
2. Adicionar logging
3. Implementar cache (Redis)
4. Adicionar rate limiting
5. Melhorar validações
6. Adicionar WebSockets para tempo real

---

## Referências

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [JWT.io](https://jwt.io/)

