const express = require('express');
const router = express.Router();
const feedLambda = require('../lambda/feedLambda');

router.get('/', async (req, res) => {
    try {
        const feedContent = await feedLambda.getFeedFromS3();
        res.status(200).json(feedContent);
    } catch (error) {
        console.error('Erro ao buscar o feed:', error);
        res.status(500).json({ error: 'Erro ao obter o feed de empregos.' });
    }
});

module.exports = router;

