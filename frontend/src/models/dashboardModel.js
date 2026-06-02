const prisma = require("../database/connect");

const DashboardModel = {
  async obterMetricas() {
    // 1. Busca todos os projetos para listar e contar os status
    const todosProjetos = await prisma.projeto.findMany({
      select: { nome: true, status: true }
    });

    // Contagem de status dos projetos usando JavaScript clássico
    const contagemProjetos = {
      criados: todosProjetos.filter(p => p.status === "Criado").length,
      emProgresso: todosProjetos.filter(p => p.status === "Em Progresso").length,
      concluidos: todosProjetos.filter(p => p.status === "Concluido").length,
    };

    // 2. Busca o total de membros cadastrados
    const totalMembros = await prisma.membro.count();

    // 3. Busca quantos membros ÚNICOS estão alocados em projetos atualmente
    const membrosAlocados = await prisma.alocacao.groupBy({
      by: ['membroId'],
    });

    const trabalhando = membrosAlocados.length;
    const esperando = totalMembros - trabalhando;

    // Retorna o objeto exatamente no formato que o Front-end precisa para preencher a tela!
    return {
      listaProjetos: todosProjetos.map(p => p.nome), // Preenche a "LISTA DE PROJETOS" da esquerda
      projetos: {
        criados: contagemProjetos.criados,
        progresso: contagemProjetos.emProgresso,
        concluidos: contagemProjetos.concluidos
      },
      desenvolvedores: {
        cadastrados: totalMembros,
        trabalhando: trabalhando,
        esperando: esperando
      }
    };
  }
};

module.exports = DashboardModel;