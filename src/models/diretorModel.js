const prisma = require("../database/connect");
const bcrypt = require("bcrypt");

const validarRGA = (rga) => /^\d{12}$/.test(rga);
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const DiretorModel = {
  // 1. Cadastro do Diretor (Com senha criptografada)
  async criar(dados) {
    const { nome, rga, email, login, senha, funcoes } = dados;

    if (!nome || !rga || !email || !login || !senha) {
      throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
    }

    if (!validarRGA(rga)) {
      throw new Error("O RGA do diretor deve conter exatamente 12 dígitos numéricos.");
    }

    if (!validarEmail(email)) {
      throw new Error("Formato de e-mail inválido.");
    }

    if (senha.length < 6) {
      throw new Error("A senha do diretor deve ter pelo menos 6 caracteres.");
    }

    if (!funcoes || !Array.isArray(funcoes) || funcoes.length === 0) {
      throw new Error("O diretor deve possuir pelo menos uma função selecionada.");
    }

    // Criptografia: Gera o hash da senha (fator de custo 10)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    return await prisma.diretor.create({
      data: {
        nome,
        rga,
        email,
        login,
        senha: senhaCriptografada, // Salva a senha protegida no Postgres
        funcoes,
      },
    });
  },

  // 2. Lógica do Login (Para a nova tela do Patinho)
  async autenticar(login, senha) {
    if (!login || !senha) {
      throw new Error("Login e senha são obrigatórios.");
    }

    // Busca o diretor pelo campo único 'login'
    const diretor = await prisma.diretor.findUnique({
      where: { login },
    });

    // Se não achar o usuário
    if (!diretor) {
      throw new Error("Usuário ou senha incorretos.");
    }

    // Compara a senha digitada com o hash criptografado do banco
    const senhaValida = await bcrypt.compare(senha, diretor.senha);

    if (!senhaValida) {
      throw new Error("Usuário ou senha incorretos.");
    }

    // Se deu tudo certo, retorna os dados do diretor (menos a senha por segurança)
    const { senha: _, ...diretorLogado } = diretor;
    return {
      mensagem: "Login efetuado com sucesso!",
      diretor: diretorLogado
    };
  }
};

module.exports = DiretorModel;