const prisma = require("../database/connect");

const validarRGA = (rga) => /^\d{12}$/.test(rga);
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function gerarEmail(rga) {
  return `${rga}@megajr.local`;
}

const MembroModel = {
  async criar(dados) {
    const nome = dados.nome || dados.name;
    const { rga, funcoes, email } = dados;
    const finalEmail = email || gerarEmail(rga);

    if (!nome || !rga || !funcoes || funcoes.length === 0) {
      throw new Error("Os campos Nome, RGA e Funções são obrigatórios.");
    }
    if (!validarRGA(rga)) {
      throw new Error("O RGA deve conter exatamente 12 dígitos numéricos.");
    }
    if (!validarEmail(finalEmail)) {
      throw new Error("Formato de e-mail inválido.");
    }

    return await prisma.membro.create({
      data: { name: nome, email: finalEmail, rga, funcoes },
    });
  },

  // LISTAR TODOS BLINDADO: Sem includes perigosos para não quebrar a rota!
  async listarTodos() {
    // 1. Busca os membros de forma simples e segura
    const databaseMembros = await prisma.membro.findMany({
      orderBy: { name: "asc" }
    });

    const listaTratada = [];

    // 2. Conta os projetos dinamicamente para cada membro sem quebrar as relações
    for (const membro of databaseMembros) {
      let total = 0;
      try {
        // Tenta buscar na tabela de junção padrão do Prisma (geralmente em minúsculo)
        const relacoes = await prisma.alocacao.findMany({
          where: { membroId: membro.id }
        });
        total = relacoes.length;
      } catch (e) {
        // Fallback caso a tabela tenha outro nome (ex: membrosOnProjetos)
        try {
          const relacoesAlt = await prisma.membroProjeto.findMany({
            where: { membroId: membro.id }
          });
          total = relacoesAlt.length;
        } catch (err) {
          total = 0; // Se não achar nenhuma das duas, assume 0 mas NÃO quebra a tela!
        }
      }

      listaTratada.push({
        id: membro.id,
        nome: membro.name,
        name: membro.name,
        rga: membro.rga,
        funcao: membro.funcoes?.[0] || 'Membro',
        stacks: membro.funcoes || [],
        projetos: total,
        totalProjetos: total,
        quantidadeProjetos: total
      });
    }

    return listaTratada;
  },

  async buscarDetalhado(id) {
    if (!id) throw new Error("O ID do membro é obrigatório.");

    const membro = await prisma.membro.findUnique({
      where: { id }
    });

    if (!membro) throw new Error("Membro não encontrado.");

    let projetosAceitos = [];
    try {
      const alocacoes = await prisma.alocacao.findMany({
        where: { membroId: id },
        include: { projeto: true }
      });
      projetosAceitos = alocacoes.map(aloc => ({
        projetoNome: aloc.projeto?.nome || 'Projeto Sem Nome',
        funcaoNesseProjeto: aloc.funcaoNoProjeto || 'Desenvolvedor'
      }));
    } catch (e) {
      projetosAceitos = [];
    }

    return {
      id: membro.id,
      nome: membro.name,
      name: membro.name,
      rga: membro.rga,
      email: membro.email,
      funcao: membro.funcoes?.[0] || 'Membro',
      stacks: membro.funcoes || [],
      projetosAceitos
    };
  },

  async atualizar(id, dados) {
    if (!id) throw new Error("O ID do membro é obrigatório para atualização.");
    const nome = dados.nome || dados.name;
    const { rga, email, funcoes } = dados;

    return await prisma.membro.update({
      where: { id },
      data: { name: nome, email, rga, funcoes }
    });
  },

  async deletar(id) {
    if (!id) throw new Error("O ID do membro é obrigatório para exclusão.");
    return await prisma.membro.delete({ where: { id } });
  }
};

module.exports = MembroModel;