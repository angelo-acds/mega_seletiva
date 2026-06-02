const prisma = require("../database/connect");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const DiretorModel = {
  // 1. CADASTRO: Criptografa a senha antes de salvar no PostgreSQL
  async criar(dados) {
    const { nome, rga, email, login, senha, funcoes } = dados;

    if (!nome || !rga || !email || !login || !senha) {
      throw new Error("Todos os campos de cadastro do Diretor são obrigatórios.");
    }

    // Criptografia de senha para blindar o critério de segurança do edital
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    return await prisma.diretor.create({
      data: {
        nome,
        rga,
        email,
        login,
        senha: senhaCriptografada,
        funcoes // Array de funções ex: ['Designer', 'Supervisor', 'Front-End']
      }
    });
  },

  // 2. LISTAGEM GERAL: Alinhada perfeitamente com a tela "LISTA DE DIRETOR"
  async listarTodos() {
    return await prisma.diretor.findMany({
      select: {
        id: true,
        nome: true
        // Não expõe email, login ou hash de senha na listagem pura por segurança
      },
      orderBy: { nome: "asc" }
    });
  },

  // 3. BUSCA INDIVIDUAL (inf. admin): Traz o RGA, as tags de Função e os Projetos Aceitos!
  async buscarPorId(id) {
    if (!id) throw new Error("O ID do diretor é obrigatório.");

    const diretor = await prisma.diretor.findUnique({
      where: { id },
      include: {
        // Como o Diretor se aloca em projetos, trazemos suas alocações
        alocacoes: {
          include: {
            projeto: true
          }
        }
      }
    });

    if (!diretor) throw new Error("Diretor não encontrado.");

    // Mapeia os dados exatamente como a caixinha "inf. admin" quer exibir
    return {
      id: diretor.id,
      nome: diretor.nome,
      rga: diretor.rga,
      funcoes: diretor.funcoes, // As badges coloridas da tela
      projetosAceitos: diretor.alocacoes.map(aloc => ({
        projetoId: aloc.projeto.id,
        nome: aloc.projeto.nome
      }))
    };
  },

  // 4. ATUALIZAÇÃO (EDITAR): Atende ao botão de editar (lápis) da lista
  async atualizar(id, dados) {
    const { nome, rga, email, login, senha, funcoes } = dados;

    if (!id) throw new Error("O ID do diretor é obrigatório para atualização.");

    const dadosAtualizados = { nome, rga, email, login, funcoes };

    // Se o diretor alterou a senha na edição, criptografa a nova senha
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, saltRounds);
    }

    return await prisma.diretor.update({
      where: { id },
      data: dadosAtualizados
    });
  },

  // 5. REMOÇÃO (DELETAR): Atende ao botão de lixeira da lista
  async deletar(id) {
    if (!id) throw new Error("O ID do diretor é obrigatório para exclusão.");

    return await prisma.diretor.delete({
      where: { id }
    });
  },

  // 6. AUTENTICAÇÃO: Lógica auxiliar para a tela de Login que criamos antes
  async verificarCredenciais(login, senha) {
    const diretor = await prisma.diretor.findUnique({ where: { login } });
    if (!diretor) return null;

    const senhaValida = await bcrypt.compare(senha, diretor.senha);
    if (!senhaValida) return null;

    return diretor;
  }
};

module.exports = DiretorModel;