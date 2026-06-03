const express = require("express");
const router = express.Router();
const MembroModel = require("../models/membroModel");

// 1. ROTA DE CRIAÇÃO DE MEMBRO (Alinhada com a tela "CADASTRO DE MEMBRO")
// POST http://localhost:8080/membros
router.post("/", async (req, res) => {
  try {
    const { name, email, rga, funcoes } = req.body;

    if (!name || !email || !rga || !funcoes) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    
    const novoMembro = await MembroModel.criar({ name, email, rga, funcoes });
    return res.status(201).json(novoMembro);
  } catch (error) {
    // Se o erro for de registro duplicado (RGA ou Email), o status 400 avisa o front direitinho
    return res.status(400).json({ error: error.message });
  }
});

// 2. ROTA DE LISTAGEM DE MEMBROS (Alinhada com a tela "LISTA DE MEMBRO")
// GET http://localhost:8080/membros
router.get("/", async (req, res) => {
  try {
    const membros = await MembroModel.listarTodos();
    return res.status(200).json(membros);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar membros." });
  }
});

// 3. ROTA DE BUSCA DE MEMBRO POR ID (Alinhada com a tela individual "inf. membros")
// GET http://localhost:8080/membros/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const membro = await MembroModel.buscarDetalhado(id);
    return res.status(200).json(membro);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// 4. ROTA DE ATUALIZAÇÃO DE MEMBRO (Alinhada com a tela individual "inf. membros")
// PUT http://localhost:8080/membros/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rga, funcoes } = req.body;
    const membroAtualizado = await MembroModel.atualizar(id, { name, email, rga, funcoes });
    return res.status(200).json({
      message: "Dados do membro atualizados com sucesso!",
      dados: membroAtualizado
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 5. ROTA DE REMOÇÃO DE MEMBRO (CRUD Completo exigido pelo Edital)
// DELETE http://localhost:8080/membros/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await MembroModel.deletar(id);
    return res.status(200).json({ message: "Membro deletado com sucesso do sistema!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;