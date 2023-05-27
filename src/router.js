import { Router } from 'express';
import * as Summarizer from '../controllers/summarizer.controller';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'welcome to our skimgpt api!' });
});

// summarizer routes
router.route('/summarizer')
.get(async (req, res) => {
    try {
        const result = await Summarizer.createSummarizer(req.body);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error });
    }
});

// section routes
router.route('/summarizer/:id')
.get(async (req, res) => {
    try {
        const result = await Summarizer.getSection(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error });
    }
});

export default router;
