var express = require('express');
var router = express.Router();
var conn = require("../connection");
const functions = require('../public/javascripts/functions');

router.post('/', async (req, res) => {
    const {
        company_id,
        title,
        description,
        location,
        notes,
    } = req.body;

    try {
        if (!company_id || !title || !description || !location || !notes) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        if (!functions.isValidUUID(company_id)) {
            return res.status(400).json({ error: 'ID da empresa inválido.' });
        }

        const companyExists = await conn.query('SELECT 1 FROM companies WHERE id = $1', [company_id]);

        if (companyExists.rows.length === 0) {
            return res.status(404).json({ error: 'A empresa associada ao trabalho não foi encontrada.' });
        }

        const result = await conn.query(
            'INSERT INTO jobs (company_id, title, description, location, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [company_id, title, description, location, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar trabalho.' });
    }
});


router.put('/:job_id/publish', async (req, res) => {
    const jobId = req.params.job_id;
    try {

        if (!functions.isValidUUID(jobId)) {
            return res.status(400).json({ error: 'ID do anuncio inválido.' });
        }
        
        const job = await conn.query('SELECT * FROM jobs WHERE id = $1', [jobId]);

        if (job.rows.length === 0) {
            return res.status(404).json({ error: 'Rascunho de anúncio de emprego não encontrado.' });
        }

        const enqueueSuccess = await functions.enqueueJobForModeration(job.rows[0]);

        if (enqueueSuccess) {
            const result = await conn.query('UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *', ['published', jobId]);

            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Rascunho de anúncio de emprego não encontrado.' });
            }
        } else {
            res.status(500).json({ error: 'Erro ao enfileirar o trabalho para moderação.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar a publicação do anúncio de emprego.' });
    }
});


router.put('/:job_id', async (req, res) => {
    const jobId = req.params.job_id;
    const { title, location, description } = req.body;

    try {
        const result = await conn.query(
            'UPDATE jobs SET title = $1, location = $2, description = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
            [title, location, description, jobId]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Rascunho de anúncio de emprego não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar o anúncio de emprego.' });
    }
});


router.delete('/:job_id', async (req, res) => {
    const jobId = req.params.job_id;

    try {
        const result = await conn.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [jobId]);

        if (result.rows.length > 0) {
            res.json({ message: 'Rascunho de anúncio de emprego excluído com sucesso.' });
        } else {
            res.status(404).json({ error: 'Rascunho de anúncio de emprego não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir o anúncio de emprego.' });
    }
});

router.put('/:job_id/archive', async (req, res) => {
    const jobId = req.params.job_id;

    try {
        const result = await conn.query('UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *', ['archived', jobId]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Anúncio de emprego não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao arquivar o anúncio de emprego.' });
    }
});


module.exports = router;