# Mega Seletiva

Projeto fullstack com backend em Node.js/Express e frontend em React.

## 📁 Estrutura do Projeto

```
mega_seletiva/
├── backend/          # API Node.js com Express e Prisma
├── frontend/         # Frontend React com Vite
└── README.md         # Este arquivo
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Git

### Backend

1. **Navegue para a pasta backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente:**
   - Crie um arquivo `.env` na pasta `backend/`
   - Adicione suas variáveis (banco de dados, porta, etc.)
   ```bash
   DATABASE_URL="sua_url_do_banco"
   PORT=3000
   ```

4. **Configure o Prisma:**
   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor em modo desenvolvimento:**
   ```bash
   npm run start:dev
   ```
   - Servidor rodará em `http://localhost:3000`

---

### Frontend

1. **Em outro terminal, navegue para a pasta frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   - Frontend rodará em `http://localhost:5173`

4. **Para fazer build de produção:**
   ```bash
   npm run build
   ```

5. **Para visualizar a build de produção:**
   ```bash
   npm run preview
   ```

---

## 🛠️ Tecnologias

### Backend
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **Bcrypt** - Hashing de senhas
- **CORS** - Permitir requisições cross-origin
- **Dotenv** - Gerenciar variáveis de ambiente
- **Nodemon** - Auto-reload em desenvolvimento

### Frontend
- **React** - Biblioteca de UI
- **Vite** - Build tool e dev server rápido
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **React Icons** - Biblioteca de ícones

---

## 📝 Comandos Úteis

### Backend
```bash
npm run start:dev     # Inicia em modo desenvolvimento
npx prisma studio    # Abre o Prisma Studio (visualizar banco)
npx prisma migrate   # Executa migrações
```

### Frontend
```bash
npm run dev           # Inicia servidor de desenvolvimento
npm run build         # Build de produção
npm run preview       # Visualiza a build
```

---

## 📂 Estrutura de Pastas

### Backend
```
backend/
├── src/              # Código principal
├── modules/          # Módulos do projeto
├── prisma/           # Schemas e migrações do banco
├── index.js          # Arquivo principal
├── package.json      # Dependências
└── prisma.config.ts  # Configuração do Prisma
```

### Frontend
```
frontend/
├── src/              # Código React
│   ├── components/   # Componentes React
│   ├── pages/        # Páginas
│   └── App.jsx       # Componente principal
├── index.html        # HTML principal
├── vite.config.js    # Configuração do Vite
└── package.json      # Dependências
```

---

## 🔐 Autenticação

O projeto usa **Bcrypt** para criptografia de senhas. Certifique-se de:
- Armazenar senhas já hasheadas no banco
- Comparar senhas com `bcrypt.compare()`

---

## 🌐 API

O backend implementa endpoints REST. Consulte a documentação da API ou os arquivos em `backend/src/` para mais detalhes.

---

## 📦 Deployment

Para fazer deploy:
- **Backend**: Pode ser deployed em Heroku, Railway, Render, etc.
- **Frontend**: Pode ser deployed em Vercel, Netlify, GitHub Pages, etc.

---

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

---

## 📄 Licença

ISC

---

## 👤 Autor

Angelo

---

**Dúvidas?** Consulte os arquivos `PROMPTS.md` ou a documentação oficial das tecnologias usadas.
