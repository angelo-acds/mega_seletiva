const MembroModel = {
  // 1. CADASTRO: Estrutura base aceita pelo formulário
  async criar(dados) {
    const { nome, name, rga, email, funcoes, stacks } = dados;
    return {
      name: name || nome,
      rga,
      email,
      funcoes: funcoes || stacks || []
    };
  },

  // 2. LISTAGEM: Normaliza a contagem de projetos para aceitar qualquer propriedade na tabela!
  async listarTodos(dadosVindosDoBack = []) {
    if (!Array.isArray(dadosVindosDoBack)) return [];

    return dadosVindosDoBack.map((membro) => {
      // Pega o número de projetos independente de como o back-end enviou
      const count = 
        membro.projetos !== undefined ? membro.projetos :
        membro.totalProjetos !== undefined ? membro.totalProjetos :
        membro.quantidadeProjetos !== undefined ? membro.quantidadeProjetos : 0;

      return {
        id: membro.id,
        nome: membro.nome || membro.name,
        name: membro.nome || membro.name,
        rga: membro.rga,
        funcao: membro.funcao || membro.funcoesGerais?.[0] || 'Membro',
        stacks: membro.stacks || membro.funcoesGerais || membro.funcoes || [],
        // Injeta o valor real em todas as chaves possíveis para forçar a tela a ler o correto
        projetos: count,
        totalProjetos: count,
        quantidadeProjetos: count
      };
    });
  },

  // 3. BUSCA DETALHADA
  async buscarDetalhado(id, dadosDoMembro) {
    if (!id) throw new Error("O ID do membro é obrigatório.");
    if (!dadosDoMembro) return null;

    return {
      id: dadosDoMembro.id,
      nome: dadosDoMembro.nome || dadosDoMembro.name,
      name: dadosDoMembro.nome || dadosDoMembro.name,
      rga: dadosDoMembro.rga,
      email: dadosDoMembro.email,
      projetosAceitos: dadosDoMembro.projetosAceitos || []
    };
  },

  // 4. ATUALIZAÇÃO
  async atualizar(id, dados) {
    if (!id) throw new Error("O ID do membro é obrigatório para atualização.");
    return { id, ...dados };
  },

  // 5. REMOÇÃO
  async deletar(id) {
    if (!id) throw new Error("O ID do membro é obrigatório para exclusão.");
    return true;
  }
};

module.exports = MembroModel;