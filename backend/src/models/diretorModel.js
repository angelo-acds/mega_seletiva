const prisma = require("../database/connect");
const bcrypt = require("bcrypt");

const saltRounds = 10;

async function gerarLogin(nome) {
  const base = nome
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
    .substring(0, 20)
    .replace(/\.+$/g, '');

  let login = base || 'diretor';
  let contador = 0;

  while (await prisma.diretor.findUnique({ where: { login } })) {
    contador += 1;
    login = `${base || 'diretor'}${contador}`;
  }

  return login;
}

function gerarEmail(login, nome) {
  if (login) return `${login}@megajr.local`;
  const base = nome
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .join('.')
    .replace(/[^a-z0-9.]/g, '')
    .substring(0, 20)
    .replace(/\.+$/g, '');
  return `${base || 'diretor'}@megajr.local`;
}

function normalizarFuncoes({ funcao, stacks, funcoes }) {
  if (Array.isArray(stacks) && stacks.length) return stacks;
  if (Array.isArray(funcoes) && funcoes.length) return funcoes;
  const cargosConhecidos = ["Diretor de Projetos", "Diretora de Pessoas", "Diretor Financeiro", "Diretor de Marketing", "Presidente"];
  if (funcao && !cargosConhecidos.includes(funcao)) return [funcao];
  return [];
}

const DiretorModel = {
  // 1. CADASTRO: Criptografa a senha e salva no Supabase dividindo Cargo de Stacks
  async criar(dados) {
    const nome = dados.nome || dados.name;
    const rga = dados.rga;
    const senha = dados.senha;
    const login = dados.login;
    const email = dados.email;
    
    const cargo = dados.funcao || dados.cargo; 
    const funcoes = dados.stacks || normalizarFuncoes(dados);

    if (!nome || !rga || !senha) {
      throw new Error('Nome, RGA e senha são obrigatórios para cadastrar um diretor.');
    }

    if (!cargo) {
      throw new Error('O cargo corporativo (ex: Presidente, Diretor de Projetos) é obrigatório.');
    }

    if (funcoes.length === 0) {
      throw new Error('Selecione ao menos uma função técnica/stack para o diretor.');
    }

    const finalLogin = login || await gerarLogin(nome);
    const finalEmail = email || gerarEmail(finalLogin, nome);
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    return await prisma.diretor.create({
      data: {
        nome,
        rga,
        email: finalEmail,
        login: finalLogin,
        senha: senhaCriptografada,
        cargo,    
        funcoes,  
      }
    });
  },

  // 2. LISTAGEM: Busca direto do banco usando as colunas novas
  async listarTodos() {
    const diretores = await prisma.diretor.findMany({
      select: {
        id: true,
        nome: true,
        rga: true,
        cargo: true,    
        funcoes: true,  
      },
      orderBy: { nome: "asc" }
    });

    return diretores.map((diretor) => ({
      id: diretor.id,
      nome: diretor.nome,
      rga: diretor.rga,
      funcao: diretor.cargo || 'Não Definido', 
      stacks: diretor.funcoes,                
    }));
  },

  // 3. BUSCA INDIVIDUAL: Traz as alocações reais do banco de dados
  async buscarPorId(id) {
    if (!id) throw new Error('O ID do diretor é obrigatório.');

    const diretor = await prisma.diretor.findUnique({
      where: { id },
      include: {
        alocacoes: {
          include: {
            projeto: true
          }
        }
      }
    });

    if (!diretor) throw new Error('Diretor não encontrado.');

    return {
      id: diretor.id,
      nome: diretor.nome,
      rga: diretor.rga,
      email: diretor.email,
      login: diretor.login,
      funcao: diretor.cargo || '', 
      stacks: diretor.funcoes,     
      projetosAceitos: diretor.alocacoes.map((aloc) => ({
        projetoId: aloc.projeto.id,
        nome: aloc.projeto.nome
      }))
    };
  },

  // 4. ATUALIZAÇÃO (EDITAR): Atualiza o Supabase real
  async atualizar(id, dados) {
    if (!id) throw new Error('O ID do diretor é obrigatório para atualização.');

    const diretorAtual = await prisma.diretor.findUnique({ where: { id } });
    if (!diretorAtual) throw new Error('Diretor não encontrado.');

    const nome = dados.nome || diretorAtual.nome;
    const rga = dados.rga || diretorAtual.rga;
    const email = dados.email || diretorAtual.email;
    const login = dados.login || diretorAtual.login;
    
    const cargo = dados.funcao || dados.cargo || diretorAtual.cargo;
    const funcoes = dados.stacks || normalizarFuncoes(dados);

    const dadosAtualizados = {
      nome,
      rga,
      email,
      login,
      cargo,
      funcoes: funcoes.length ? funcoes : diretorAtual.funcoes
    };

    if (dados.senha) {
      dadosAtualizados.senha = await bcrypt.hash(dados.senha, saltRounds);
    }

    return await prisma.diretor.update({
      where: { id },
      data: dadosAtualizados
    });
  },

  // 5. REMOÇÃO (DELETAR)
  async deletar(id) {
    if (!id) throw new Error("O ID do diretor é obrigatório para exclusão.");

    return await prisma.diretor.delete({
      where: { id }
    });
  },

  // 6. AUTENTICAÇÃO
  async verificarCredenciais(login, senha) {
    const diretor = await prisma.diretor.findUnique({ where: { login } });
    if (!diretor) return null;

    const senhaValida = await bcrypt.compare(senha, diretor.senha);
    if (!senhaValida) return null;

    return diretor;
  }
};

module.exports = DiretorModel;