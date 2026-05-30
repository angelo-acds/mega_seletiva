const express = require("express");
const router = express.Router();
const DiretorModel = require("../models/diretorModel");

// 1. ROTA DE LOGIN (Autenticação do Admin)
// POST http://localhost:8080/diretores/login
router.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;
    
    if (!login || !senha) {
      return res.status(400).json({ error: "Login e senha são obrigatórios." });
    }

    const diretor = await DiretorModel.verificarCredenciais(login, senha);
    
    if (!diretor) {
      return res.status(401).json({ error: "Credenciais inválidas. Login ou senha incorretos." });
    }

    // Retorna os dados essenciais para o Frontend gerenciar a sessão do usuário
    return res.status(200).json({
      message: "Login realizado com sucesso!",
      diretor: {
        id: diretor.id,
        nome: diretor.nome,
        login: diretor.login
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno ao tentar realizar o login." });
  }
});

// 2. LISTAR TODOS OS DIRETORES (Alinhado com a tela "LISTA DE DIRETOR")
// GET http://localhost:8080/diretores
router.get("/", async (req, res) => {
  try {
    const diretores = await DiretorModel.listarTodos();
    return res.status(200).json(diretores);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar diretores." });
  }
});

// 3. BUSCAR DIRETOR POR ID (Alinhado com a tela individual "inf. admin")
// GET http://localhost:8080/diretores/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const diretor = await DiretorModel.buscarPorId(id);
    return res.status(200).json(diretor);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// 4. CADASTRAR NOVO DIRETOR
// POST http://localhost:8080/diretores
router.post("/", async (req, res) => {
  try {
    const novoDiretor = await DiretorModel.criar(req.body);
    return res.status(201).json({
      message: "Diretor cadastrado com sucesso!",
      dados: novoDiretor
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 5. ATUALIZAR DIRETOR (Botão editar - Lápis)
// PUT http://localhost:8080/diretores/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const diretorAtualizado = await DiretorModel.atualizar(id, req.body);
    return res.status(200).json({
      message: "Dados do diretor atualizados com sucesso!",
      dados: diretorAtualizado
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 6. DELETAR DIRETOR (Botão remover - Lixeira)
// DELETE http://localhost:8080/diretores/:id

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await DiretorModel.deletar(id);
    return res.status(200).json({ message: "Diretor removido com sucesso!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;