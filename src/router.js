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
      return res.status(404).json({ error });
    }
  })
  .get(async (req, res) => {
    try {
      console.log('inside get');
      const result = await Summarizer.getOverview();
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

// section routes
router.route('/summarizer/:id')
  .get(async (req, res) => {
    try {
      const result = await Summarizer.getSection(req.params.id);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

export default router;
