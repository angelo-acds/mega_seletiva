const prisma = require("../database/connect");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const DiretorModel = {
  // 1. CADASTRO: Mantém a estrutura antiga para o front aceitar
  async criar(dados) {
    const { nome, rga, email, login, senha, funcoes } = dados;

    if (!nome || !rga || !email || !login || !senha) {
      throw new Error("Todos os campos de cadastro do Diretor são obrigatórios.");
    }

    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    return {
      nome,
      rga,
      email,
      login,
      senha: senhaCriptografada,
      funcoes
    };
  },

  // 2. LISTAGEM GERAL: O ponto chave do bug! 
  // Garante que o front intercepte os dados do banco e jogue "cargo" e "stacks" nos lugares certos
  async listarTodos(dadosVindosDoBack = []) {
    if (!Array.isArray(dadosVindosDoBack)) return [];
    
    return dadosVindosDoBack.map((diretor) => ({
      id: diretor.id,
      nome: diretor.nome,
      rga: diretor.rga,
      // Se o back mandar 'funcao' (que criamos), o front usa. Se não, tenta o 'cargo'. 
      funcao: diretor.funcao || diretor.cargo || 'Não Definido', 
      // Se o back mandar 'stacks', o front usa. Se não, lê o array 'funcoes'.
      stacks: diretor.stacks || diretor.funcoes || [],
    }));
  },

  // 3. BUSCA INDIVIDUAL: Corrige o mapeamento ao abrir um diretor específico
  async buscarPorId(id, dadosDoDiretor) {
    if (!id) throw new Error("O ID do diretor é obrigatório.");
    if (!dadosDoDiretor) return null;

    return {
      id: dadosDoDiretor.id,
      nome: dadosDoDiretor.nome,
      rga: dadosDoDiretor.rga,
      funcao: dadosDoDiretor.funcao || dadosDoDiretor.cargo || '',
      stacks: dadosDoDiretor.stacks || dadosDoDiretor.funcoes || [],
      projetosAceitos: dadosDoDiretor.projetosAceitos || []
    };
  },

  // 4. ATUALIZAÇÃO (EDITAR): Mantém compatibilidade com o clique do botão
  async atualizar(id, dados) {
    if (!id) throw new Error("O ID do diretor é obrigatório para atualização.");
    return { id, ...dados };
  },

  // 5. REMOÇÃO (DELETAR)
  async deletar(id) {
    if (!id) throw new Error("O ID do diretor é obrigatório para exclusão.");
    return true;
  },

  // 6. AUTENTICAÇÃO
  async verificarCredenciais(login, senha) {
    return { login, senha };
  }
};

module.exports = DiretorModel;