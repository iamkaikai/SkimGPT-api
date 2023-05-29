import { Router } from 'express';
import * as Summarizer from './controllers/summarizer_controller';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ message: 'welcome to our skimgpt api!' });
});

// summarizer routes
router.route('/summarizer')
  .post(async (req, res) => {
    const initInfo = req.body;
    try {
      const result = await Summarizer.createSummarizer(initInfo);
      return res.json(result);
    } catch (error) {
      console.log('summarizer post error!');
      return res.status(403).json({ error });
    }
  })
  .get(async (req, res) => {
    const initInfo = req.body;
    try {
      const result = await Summarizer.getSummarizer(initInfo);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

// section routes
router.route('/summarizer/:id')
  .get(async (req, res) => {
    try {
      console.log('inside get section');
      const result = await Summarizer.getSection(req.params.id);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

// get overview route (of all sections)
router.route('/overview')
  .get(async (req, res) => {
    try {
      const result = await Summarizer.getOverview();
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });
// add url identifier for overview

export default router;
