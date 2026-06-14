// frontend/src/models/projetoModel.js (Puro e seguro para o React)
const ProjetoModel = {
  async listarTodos(dados) { return dados || []; },
  async criar(dados) { return dados; },
  async buscarPorId(id, dados) { return dados; },
  async atualizar(id, dados) { return dados; },
  async deletar(id) { return true; }
};

module.exports = ProjetoModel;