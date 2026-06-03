# 📚 Documentação da API

## Base URL
```
http://localhost:3000
```

## Autenticação

A maioria dos endpoints requer autenticação via **JWT Token**.

### Enviar Token
Adicione o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## Endpoints

### 🔐 Autenticação

#### Register (Registrar Usuário)
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "id": "user-123",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### Login (Entrar)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "id": "user-123",
  "name": "João Silva",
  "email": "joao@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (401):**
```json
{
  "error": "Credenciais inválidas"
}
```

---

#### Logout
```http
POST /auth/logout
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### 👥 Usuários

#### Listar Usuários
```http
GET /users
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Response (200):**
```json
{
  "users": [
    {
      "id": "user-123",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

#### Obter Usuário por ID
```http
GET /users/:id
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "id": "user-123",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error (404):**
```json
{
  "error": "Usuário não encontrado"
}
```

---

#### Atualizar Usuário
```http
PUT /users/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.silva@example.com"
}
```

**Response (200):**
```json
{
  "id": "user-123",
  "name": "João Silva Santos",
  "email": "joao.silva@example.com",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

---

#### Deletar Usuário
```http
DELETE /users/:id
Authorization: Bearer YOUR_TOKEN
```

**Response (204):**
```
(Sem conteúdo)
```

---

## Status Codes

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Sucesso sem conteúdo |
| 400 | Bad Request - Erro na requisição |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Acesso negado |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Exemplos com cURL

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Listar Usuários
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Testing Tools

Use uma dessas ferramentas para testar os endpoints:

- **[Postman](https://www.postman.com/)** - Interface gráfica completa
- **[Insomnia](https://insomnia.rest/)** - Alternativa moderna
- **[Thunder Client](https://www.thunderclient.com/)** - Plugin do VS Code
- **[cURL](https://curl.se/)** - Linha de comando

---

## Rate Limiting

Atualmente não implementado. Implementar em produção!

---

## CORS

O backend permite requisições de:
```
http://localhost:5173  (Frontend desenvolvimento)
```

Para adicionar mais origens, edite `.env`:
```
CORS_ORIGIN="http://localhost:5173,https://seu-dominio.com"
```

---

## Versioning

API versão: **v1.0.0**

Todas as rotas começam com `/api/v1` em produção.

---

## Precisa de Ajuda?

- Consulte [SETUP.md](SETUP.md) para configuração
- Veja [CONTRIBUTING.md](../CONTRIBUTING.md) para padrões de código

