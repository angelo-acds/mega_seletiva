const express = require("express");
const router = express.Router(); 
const ProjetoModel = require("../models/projetoModel");
const prisma = require("../database/connect"); // Importando a conexão para rodar o delete direto

// 1. ROTA DE CRIAÇÃO DE PROJETO (Alinhada com a tela "CADASTRO DE PROJETO")
router.post("/", async (req, res) => {
  try {
    const { nome, descricao, status, dataLimite } = req.body;
    if (!nome) {
      return res.status(400).json({ error: "O nome do projeto é obrigatório." });
    }

    // aceitamos dois formatos vindos do frontend
    // - alocacoes: array de { membroId?, diretorId?, funcaoNoProjeto }
    // - alocacao: object { funcao: [ids] } (formato legado)
    let alocacoes = [];
    if (Array.isArray(req.body.alocacoes)) {
      alocacoes = req.body.alocacoes.map((a) => ({ ...a }));
    } else if (req.body.alocacao && typeof req.body.alocacao === 'object') {
      Object.entries(req.body.alocacao).forEach(([funcao, membros]) => {
        if (Array.isArray(membros)) {
          membros.forEach((membroId) => {
            if (membroId) alocacoes.push({ membroId, funcaoNoProjeto: funcao });
          });
        } else if (membros) {
          alocacoes.push({ membroId: membros, funcaoNoProjeto: funcao });
        }
      });
    }

    const novoProjeto = await ProjetoModel.criar({ nome, descricao, status, dataLimite, alocacoes });
    return res.status(201).json(novoProjeto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 2. ROTA DE LISTAGEM DE PROJETOS (Alinhada com a tela "LISTA DE PROJETO")
router.get("/", async (req, res) => {
  try {
    const projetos = await ProjetoModel.listarTodos();
    return res.status(200).json(projetos);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar projetos." });
  }
});

// 3. ROTA DE BUSCA DE PROJETO POR ID (Alinhada com a tela individual "inf. projeto")
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const projeto = await ProjetoModel.buscarPorId(id);
    return res.status(200).json(projeto);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// 4. ROTA DE ATUALIZAÇÃO DE PROJETO (Botão "Salvar" na tela "inf. projeto")
// PUT http://localhost:8080/projetos/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { alocacoes } = req.body;

    if (Array.isArray(alocacoes)) {
      // atualiza projeto e substitui alocações em transação
      const updated = await prisma.$transaction(async (tx) => {
        const projeto = await tx.projeto.update({
          where: { id },
          data: {
            nome: req.body.nome,
            descricao: req.body.descricao,
            status: req.body.status,
            dataLimite: req.body.dataLimite ? new Date(req.body.dataLimite) : undefined,
          }
        });

        // remove todas as alocações existentes do projeto
        await tx.alocacao.deleteMany({ where: { projetoId: id } });

        const createData = alocacoes.map((a) => ({
          projetoId: id,
          membroId: a.membroId || null,
          diretorId: a.diretorId || null,
          funcaoNoProjeto: a.funcaoNoProjeto,
        }));

        if (createData.length) await tx.alocacao.createMany({ data: createData });

        return projeto;
      });

      return res.status(200).json({ message: "Projeto atualizado com sucesso!", dados: updated });
    }

    // fallback: apenas atualiza campos do projeto
    const projetoAtualizado = await ProjetoModel.atualizar(id, req.body);
    return res.status(200).json({ message: "Projeto atualizado com sucesso!", dados: projetoAtualizado });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 5. ROTA DE ALOCAR MEMBRO EM PROJETO
// POST http://localhost:8080/projetos/:id/alocar
router.post("/:id/alocar", async (req, res) => {
  try {
    const { id } = req.params;
    const { membroId, funcaoNoProjeto } = req.body;

    if (!membroId || !funcaoNoProjeto) {
      return res.status(400).json({ error: "Membro e função são obrigatórios para a alocação." });
    }

    const alocacao = await prisma.alocacao.create({
      data: {
        projetoId: id,
        membroId,
        funcaoNoProjeto,
      }
    });

    return res.status(201).json(alocacao);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 6. ROTA DE DESALOCAR MEMBRO POR PROJETO E MEMBRO
// DELETE http://localhost:8080/projetos/:projetoId/alocar/:membroId
router.delete("/:projetoId/alocar/:membroId", async (req, res) => {
  try {
    const { projetoId, membroId } = req.params;

    await prisma.alocacao.deleteMany({
      where: {
        projetoId,
        membroId,
      }
    });

    return res.status(200).json({ message: "Membro desalocado com sucesso." });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// 7. ROTA DE DESALOCAR MEMBRO (Botão da Lixeira ao lado do nome do membro na tela "inf. projeto")
// DELETE http://localhost:8080/projetos/desalocar/:alocacaoId
router.delete("/desalocar/:alocacaoId", async (req, res) => {
  try {
    const { alocacaoId } = req.params;

    if (!alocacaoId) {
      return res.status(400).json({ error: "O ID da alocação é obrigatório." });
    }

    // Executa a remoção direto na tabela intermediária do Prisma
    await prisma.alocacao.delete({
      where: { id: alocacaoId }
    });

    return res.status(200).json({ message: "Membro removido da equipe do projeto com sucesso!" });
  } catch (error) {
    return res.status(400).json({ error: "Erro ao remover membro do projeto: " + error.message });
  }
});

// 6. ROTA DE DELETAR PROJETO INTEIRO (CRUD Completo exigido pelo Edital e que implementar no Figma com o botão "Remover Projeto" na tela "inf. projeto")
// DELETE http://localhost:8080/projetos/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ProjetoModel.deletar(id);
    return res.status(200).json({ message: "Projeto e todas as suas alocações foram removidos com sucesso!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;