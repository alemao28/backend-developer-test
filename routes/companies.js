var express = require('express');
var router = express.Router();
var conn = require("../connection");

router.get('/', async (req, res) => {
    try {
        const result = await conn.query('SELECT * FROM companies');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar empresas.' });
    }
});

router.get('/:company_id', async (req, res) => {
    const companyId = req.params.company_id;
    try {
        const result = await conn.query('SELECT * FROM companies WHERE id = $1', [companyId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Empresa não encontrada.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar empresa.' });
    }
});

module.exports = router;