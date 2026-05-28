/*
  Warnings:

  - A unique constraint covering the columns `[diretorId,projetoId]` on the table `Alocacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Alocacao" ADD COLUMN     "diretorId" TEXT,
ALTER COLUMN "membroId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Alocacao_diretorId_projetoId_key" ON "Alocacao"("diretorId", "projetoId");

-- AddForeignKey
ALTER TABLE "Alocacao" ADD CONSTRAINT "Alocacao_diretorId_fkey" FOREIGN KEY ("diretorId") REFERENCES "Diretor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
