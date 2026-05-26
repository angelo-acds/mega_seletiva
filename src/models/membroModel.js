const prisma = require("../database/connect");

const validarRGA = (rga) => /^\d{12}$/.test(rga);
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const MembroModel = {
  // Mantemos o criar intacto
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
          select: { alocacoes: true } // O Prisma conta quantos projetos o membro tem direto no banco
        }
      },
      orderBy: { name: "asc" } // Organiza em ordem alfabética para a lista ficar bonita
    });

    // Mapeia para um formato idêntico ao que a lista do Figma desenhou
    return membros.map(m => ({
      id: m.id,
      name: m.name,
      funcoesGerais: m.funcoes, // As tags de habilidades (ex: ['Back-End', 'Data Base'])
      totalProjetos: m._count.alocacoes // O número da tag (05, 04, 02)
    }));
  },

  // 2. INTELIGÊNCIA DA TELA INDIVIDUAL (inf. membros): Traz os projetos aceitos e as funções deles
  async buscarDetalhado(id) {
    if (!id) throw new Error("O ID do membro é obrigatório.");

    const membro = await prisma.membro.findUnique({
      where: { id },
      include: {
        alocacoes: {
          include: {
            projeto: true // Inclui os dados reais do projeto (nome)
          }
        }
      }
    });

    if (!membro) throw new Error("Membro não encontrado.");

    // Estrutura os dados limpinhos para a tela de "Projetos aceitos"
    return {
      name: m.name,
      rga: m.rga,
      email: m.email,
      projetosAceitos: membro.alocacoes.map(alocacao => ({
        projetoNome: alocacao.projeto.nome,
        funcaoNesseProjeto: alocacao.funcaoNoProjeto // A tag colorida ao lado do projeto!
      }))
    };
  }
};

module.exports = MembroModel;