const express = require("express");
const router = express.Router();
const DashboardModel = require("../models/dashboardModel");

// 1. ROTA DAS MÉTRICAS DO DASHBOARD (Alinhada com os cards da tela inicial)
// GET http://localhost:8080/dashboard
router.get("/", async (req, res) => {
  try {
    const metricas = await DashboardModel.obterMetricas();
    return res.status(200).json(metricas);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao carregar os dados do Dashboard." });
  }
});

module.exports = router;