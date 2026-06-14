const prisma = require("../database/connect");

const ProjetoModel = {
  // 1. LISTAGEM GERAL: Alinhada com a tela "Lista de Projetos"
  async listarTodos() {
    const projetos = await prisma.projeto.findMany({
      include: {
        _count: {
          select: { alocacoes: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return projetos.map((projeto) => ({
      id: projeto.id,
      nome: projeto.nome,
      status: projeto.status,
      dataLimite: projeto.dataLimite,
      membros: projeto._count.alocacoes,
    }));
  },

  // 2. CADASTRO COMPLETO: Identifica inteligentemente se é Diretor ou Membro comum
  async criar(dados) {
    const { nome, descricao, status = "Criado", dataLimite, alocacoes } = dados;

    if (!nome) {
      throw new Error("O nome do projeto é obrigatório.");
    }

    return await prisma.$transaction(async (tx) => {
      const novoProjeto = await tx.projeto.create({
        data: {
          nome,
          descricao,
          status,
          dataLimite: dataLimite ? new Date(dataLimite) : null,
        }
      });

      if (alocacoes && Array.isArray(alocacoes) && alocacoes.length > 0) {
        const dadosAlocacao = alocacoes.map(aloc => {
          // Se a função for Gerente de Projeto ou Supervisor, tratamos como Diretor
          const ehDiretor = aloc.funcaoNoProjeto === "Gerente de Projeto" || aloc.funcaoNoProjeto === "Supervisor";
          
          return {
            projetoId: novoProjeto.id,
            funcaoNoProjeto: aloc.funcaoNoProjeto,
            // Preenche a coluna correta baseada no cargo para não salvar nulo no banco!
            diretorId: ehDiretor ? (aloc.membroId || aloc.diretorId) : null,
            membroId: !ehDiretor ? (aloc.membroId || aloc.id) : null
          };
        });

        await tx.alocacao.createMany({
          data: dadosAlocacao
        });
      }

      return novoProjeto;
    });
  },

  // 3. BUSCA INDIVIDUAL: Faz o include do Diretor para que ele apareça na tela!
  async buscarPorId(id) {
    if (!id) throw new Error("O ID do projeto é obrigatório.");

    const projeto = await prisma.projeto.findUnique({
      where: { id },
      include: {
        alocacoes: {
          include: {
            membro: {
              select: { id: true, name: true }
            },
            diretor: {
              select: { id: true, nome: true } // Traz o nome do Diretor alocado!
            }
          }
        }
      }
    });

    if (!projeto) {
      throw new Error("Projeto não encontrado.");
    }

    // Normaliza os nomes das chaves para bater com o que o Front-end espera
    const equipes = {
      "Back-End": [],
      "Front-End": [],
      "Designer": [],
      "Data Base": [],
      "Mobile": [],
      "Gerente de Projeto": [], // Adicionado para bater com a função real
      "Supervisor": []
    };

    projeto.alocacoes.forEach((aloc) => {
      const funcao = aloc.funcaoNoProjeto;
      
      // Pega o nome do Membro ou o nome do Diretor dependendo de quem está preenchido
      const nomeAlocado = aloc.membro?.name || aloc.diretor?.nome || "Não identificado";
      const idAlocado = aloc.membroId || aloc.diretorId;

      if (equipes[funcao]) {
        equipes[funcao].push({
          alocacaoId: aloc.id,
          membroId: idAlocado,
          nome: nomeAlocado,
        });
      }
    });

    return {
      id: projeto.id,
      nome: projeto.nome,
      descricao: projeto.descricao,
      status: projeto.status,
      dataLimite: projeto.dataLimite,
      equipes,
      alocacoes: projeto.alocacoes.map((aloc) => ({
        id: aloc.id,
        membroId: aloc.membroId || aloc.diretorId,
        nome: aloc.membro?.name || aloc.diretor?.nome || null,
        funcaoNoProjeto: aloc.funcaoNoProjeto,
      })),
    };
  },

  // 4. ATUALIZAÇÃO (EDITAR): Atualiza dados do projeto
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

  // 5. REMOÇÃO (DELETAR)
  async deletar(id) {
    if (!id) throw new Error("O ID do projeto é obrigatório para exclusão.");
    return await prisma.projeto.delete({
      where: { id }
    });
  }
};

module.exports = ProjetoModel;