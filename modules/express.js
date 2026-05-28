const express = require("express");
const app = express();

// Middleware obrigatório para o Express entender JSON no corpo da requisição (req.body)
app.use(express.json());

// Inicialização do servidor (mantenha a porta que você já configurou)
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando com express na porta ${PORT}`);
});