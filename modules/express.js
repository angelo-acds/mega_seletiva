const express = require("express");
const Membro = require("../src/models/membroModel");
const app = express();

// Middleware obrigatório para o Express entender JSON no corpo da requisição (req.body)
app.use(express.json());

// Rotas ainda em desenvolvimento

// Inicialização do servidor (mantenha a porta que você já configurou)
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando com express na porta ${PORT}`);
});