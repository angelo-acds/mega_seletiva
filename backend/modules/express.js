const express = require("express");
const cors = require("cors");

// Importando as rotas dos módulos
const diretorRoutes = require("../src/routes/diretorRoutes");
const membroRoutes = require("../src/routes/membroRoutes");
const projetoRoutes = require("../src/routes/projetoRoutes");
const dashboardRoutes = require("../src/routes/dashboardRoutes");

const app = express();

// Middlewares Globais
app.use(cors()); // Permite que o Front-End acesse a API tranquilamente
app.use(express.json()); // Habilita o servidor a entender requisições em formato JSON

// Vinculando os prefixos das rotas aos arquivos correspondentes
app.use("/diretores", diretorRoutes);
app.use("/membros", membroRoutes);
app.use("/projetos", projetoRoutes);
app.use("/dashboard", dashboardRoutes);

// Porta do servidor (geralmente usa 8080 ou lê do .env)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}!`);
  console.log(`🔌 Conectado ao banco de dados PostgreSQL no Supabase.`);
});

module.exports = app;