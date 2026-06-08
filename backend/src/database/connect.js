const { PrismaClient } = require("@prisma/client");

// No Prisma 6, o construtor fica vazio e pega o .env sozinho
const prisma = new PrismaClient();

module.exports = prisma;
