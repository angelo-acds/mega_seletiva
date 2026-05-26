const prisma = require("../database/connect");

const ProjetoModel = {
  // 1. LISTAGEM GERAL: Alinhada com a tela "Lista de Projetos"
  async listarTodos() {
    return await prisma.projeto.findMany({
      select: {
        id: true,
        nome: true,
        status: true,
        dataLimite: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  // 2. CADASTRO COMPLETO: Cria o projeto e faz a alocação inicial transacional
  async criar(dados) {
    const { nome, descricao, dataLimite, alocacoes } = dados;

    if (!nome) {
      throw new Error("O nome do projeto é obrigatório.");
    }

    return await prisma.$transaction(async (tx) => {
      const novoProjeto = await tx.projeto.create({
        data: {
          nome,
          descricao,
          dataLimite: dataLimite ? new Date(dataLimite) : null,
          status: "Criado"
        }
      });

      if (alocacoes && Array.isArray(alocacoes) && alocacoes.length > 0) {
        const dadosAlocacao = alocacoes.map(aloc => ({
          projetoId: novoProjeto.id,
          membroId: aloc.membroId,
          funcaoNoProjeto: aloc.funcaoNoProjeto
        }));

        await tx.alocacao.createMany({
          data: dadosAlocacao
        });
      }

      return novoProjeto;
    });
  },

  // 3. BUSCA INDIVIDUAL DETALHADA: Crucial para renderizar a tela "inf. projeto"!
  async buscarPorId(id) {
    if (!id) throw new Error("O ID do projeto é obrigatório.");

    const projeto = await prisma.projeto.findUnique({
      where: { id },
      include: {
        alocacoes: {
          include: {
            membro: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!projeto) {
      throw new Error("Projeto não encontrado.");
    }

    // Estrutura inicial do mapeamento por equipes baseado no Figma
    const equipes = {
      "Back-End": [],
      "Front-End": [],
      "Designer": [],
      "Data Base": [],
      "Mobile": [],
      "Supervisor": []
    };

    // Alimenta dinamicamente cada caixinha da tela
    projeto.alocacoes.forEach(aloc => {
      const funcao = aloc.funcaoNoProjeto;
      if (equipes[funcao]) {
        equipes[funcao].push({
          alocacaoId: aloc.id,
          membroId: aloc.membroId,
          nome: aloc.membro.name
        });
      }
    });

    // Devolve o projeto limpo com as equipes já separadas para o Frontend só renderizar
    return {
      id: projeto.id,
      nome: projeto.nome,
      descricao: projeto.descricao,
      status: projeto.status,
      dataLimite: projeto.dataLimite,
      equipes
    };
  },

  // 4. ATUALIZAÇÃO (EDITAR): Atende ao botão "Salvar" e edição de membros da tela
  async atualizar(id, dados) {
    const { nome, descricao, status, dataLimite } = dados;

    if (!id) throw new Error("O ID do projeto é obrigatório para atualização.");

    return await prisma.projeto.update({
      where: { id },
      data: {
        nome,
        descricao,
        status,
        dataLimite: dataLimite ? new Date(dataLimite) : undefined
      }
    });
  },

  // 5. REMOÇÃO (DELETAR): Completa o ciclo do CRUD exigido pelo edital
  async deletar(id) {
    if (!id) throw new Error("O ID do projeto é obrigatório para exclusão.");

    // Como colocamos "onDelete: Cascade" no schema.prisma, as alocações deste projeto
    // serão deletadas automaticamente pelo banco! Segurança e elegância.
    return await prisma.projeto.delete({
      where: { id }
    });
  }
};

module.exports = ProjetoModel;