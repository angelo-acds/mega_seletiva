const prisma = require("../database/connect");

const validarRGA = (rga) => /^\d{12}$/.test(rga);
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const MembroModel = {
  async criar(dados) {
    const { name, email, rga, funcoes } = dados;

    if (!name || !email || !rga) {
      throw new Error("Os campos Nome, Email e RGA são obrigatórios.");
    }
    if (!funcoes || !Array.isArray(funcoes) || funcoes.length === 0) {
      throw new Error("O membro deve possuir pelo menos uma função selecionada.");
    }
    if (!validarRGA(rga)) {
      throw new Error("O RGA deve conter exatamente 12 dígitos numéricos.");
    }
    if (!validarEmail(email)) {
      throw new Error("Formato de e-mail inválido.");
    }

    return await prisma.membro.create({
      data: { name, email, rga, funcoes },
    });
  },

  async listarTodos() {
    const membros = await prisma.membro.findMany({
      include: {
        _count: {
          select: { alocacoes: true }
        }
      },
      orderBy: { name: "asc" }
    });

    return membros.map(membro => ({
      id: membro.id,
      name: membro.name,
      funcoesGerais: membro.funcoes,
      totalProjetos: membro._count.alocacoes
    }));
  },

  async buscarDetalhado(id) {
    if (!id) throw new Error("O ID do membro é obrigatório.");

    const membro = await prisma.membro.findUnique({
      where: { id },
      include: {
        alocacoes: {
          include: {
            projeto: true
          }
        }
      }
    });

    if (!membro) throw new Error("Membro não encontrado.");

    return {
      name: membro.name,
      rga: membro.rga,
      email: membro.email,
      projetosAceitos: membro.alocacoes.map(alocacao => ({
        projetoNome: alocacao.projeto.nome,
        funcaoNesseProjeto: alocacao.funcaoNoProjeto
      }))
    };
  },

  async atualizar(id, dados) {
    if (!id) throw new Error("O ID do membro é obrigatório para atualização.");
    const { name, email, rga, funcoes } = dados;

    if (!name || !email || !rga || !funcoes) {
      throw new Error("Todos os campos são obrigatórios para atualização.");
    }
    if (!validarRGA(rga)) {
      throw new Error("O RGA deve conter exatamente 12 dígitos numéricos.");
    }
    if (!validarEmail(email)) {
      throw new Error("Formato de e-mail inválido.");
    }

    return await prisma.membro.update({
      where: { id },
      data: { name, email, rga, funcoes },
    });
  },

  async deletar(id) {
    if (!id) throw new Error("O ID do membro é obrigatório para exclusão.");
    
    return await prisma.membro.delete({
      where: { id },
    });
  }
};

module.exports = MembroModel;