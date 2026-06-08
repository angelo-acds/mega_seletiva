const prisma = require("../database/connect");

const validarRGA = (rga) => /^\d{12}$/.test(rga);
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function gerarEmail(rga) {
  return `${rga}@megajr.local`;
}

function normalizarFuncoes({ funcao, stacks, funcoes }) {
  if (Array.isArray(stacks) && stacks.length) return stacks;
  if (Array.isArray(funcoes) && funcoes.length) return funcoes;
  if (funcao) return [funcao];
  return [];
}

const MembroModel = {
  async criar(dados) {
    const nome = dados.nome || dados.name;
    const rga = dados.rga;
    const funcoes = normalizarFuncoes(dados);
    const email = dados.email || gerarEmail(rga);

    if (!nome || !rga || funcoes.length === 0) {
      throw new Error("Os campos Nome, RGA e Funções são obrigatórios.");
    }
    if (!validarRGA(rga)) {
      throw new Error("O RGA deve conter exatamente 12 dígitos numéricos.");
    }
    if (!validarEmail(email)) {
      throw new Error("Formato de e-mail inválido.");
    }

    return await prisma.membro.create({
      data: { name: nome, email, rga, funcoes },
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

    return membros.map((membro) => ({
      id: membro.id,
      nome: membro.name,
      rga: membro.rga,
      funcao: membro.funcoes[0] || '',
      stacks: membro.funcoes,
      projetos: membro._count.alocacoes,
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
      id: membro.id,
      nome: membro.name,
      rga: membro.rga,
      email: membro.email,
      funcao: membro.funcoes[0] || '',
      stacks: membro.funcoes,
      projetosAceitos: membro.alocacoes.map(alocacao => ({
        projetoNome: alocacao.projeto.nome,
        funcaoNesseProjeto: alocacao.funcaoNoProjeto
      }))
    };
  },

  async atualizar(id, dados) {
    if (!id) throw new Error("O ID do membro é obrigatório para atualização.");

    const membroAtual = await prisma.membro.findUnique({ where: { id } });
    if (!membroAtual) throw new Error("Membro não encontrado.");

    const nome = dados.nome || membroAtual.name;
    const rga = dados.rga || membroAtual.rga;
    const funcoes = normalizarFuncoes(dados);
    const email = dados.email || membroAtual.email || gerarEmail(rga);

    if (!nome || !rga || funcoes.length === 0) {
      throw new Error("Os campos Nome, RGA e Funções são obrigatórios.");
    }
    if (!validarRGA(rga)) {
      throw new Error("O RGA deve conter exatamente 12 dígitos numéricos.");
    }
    if (!validarEmail(email)) {
      throw new Error("Formato de e-mail inválido.");
    }

    return await prisma.membro.update({
      where: { id },
      data: { name: nome, email, rga, funcoes },
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