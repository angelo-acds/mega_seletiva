-- CreateTable
CREATE TABLE "Membro" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rga" TEXT NOT NULL,
    "funcoes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dataLimite" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alocacao" (
    "id" TEXT NOT NULL,
    "membroId" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "funcaoNoProjeto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alocacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diretor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rga" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "funcoes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diretor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membro_email_key" ON "Membro"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Membro_rga_key" ON "Membro"("rga");

-- CreateIndex
CREATE UNIQUE INDEX "Alocacao_membroId_projetoId_key" ON "Alocacao"("membroId", "projetoId");

-- CreateIndex
CREATE UNIQUE INDEX "Diretor_rga_key" ON "Diretor"("rga");

-- CreateIndex
CREATE UNIQUE INDEX "Diretor_email_key" ON "Diretor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Diretor_login_key" ON "Diretor"("login");

-- AddForeignKey
ALTER TABLE "Alocacao" ADD CONSTRAINT "Alocacao_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alocacao" ADD CONSTRAINT "Alocacao_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
