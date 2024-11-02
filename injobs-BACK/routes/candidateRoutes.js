// routes/candidateRoutes.js
const express = require('express');
const connectDB = require('../config/db');
const router = express.Router();

// Rota para obter todos os candidatos
router.get('/job/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        const db = await connectDB();
        const candidateCollection = db.collection('candidates');
        const candidates = await candidateCollection.find({ jobId }).toArray();
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidatos', error: error.message });
    }
});

module.exports = router;
