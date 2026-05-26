const dotenv = require("dotenv");
// Carrega as variáveis do arquivo .env
dotenv.config();

// Importa o prisma (só precisamos importar uma vez!)
const prisma = require("./src/database/connect");

// Ative a linha do express para o seu servidor rodar
require("./modules/express");
