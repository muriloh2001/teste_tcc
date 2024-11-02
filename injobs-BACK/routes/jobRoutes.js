// Importações necessárias
const express = require('express');
const Job = require('./models/Job'); // Ajuste o caminho conforme necessário
const router = express.Router();

// Rota para buscar vagas da empresa
router.get('/api/jobs/company/:companyId', async (req, res) => {
    const { companyId } = req.params; // Pega o companyId da URL

    try {
        const jobs = await Job.find({ company_id: companyId }); // Ajuste o campo conforme sua estrutura de banco de dados
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: 'Nenhuma vaga encontrada.' });
        }
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Erro ao buscar vagas: ', error);
        res.status(500).json({ message: 'Erro ao buscar vagas.' });
    }
});

// Exporta o router se necessário
module.exports = router;
