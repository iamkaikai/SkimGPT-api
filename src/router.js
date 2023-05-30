import { Router } from 'express';
import * as Summarizer from './controllers/summarizer_controller';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ message: 'welcome to our skimgpt api!' });
});

// summarizer routes
router.route('/summarizers')
  .post(async (req, res) => {
    const initInfo = req.body;
    try {
      Summarizer.createSummarizer(initInfo);
      return res.json(`get ${initInfo.url}`);
    } catch (error) {
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

export default router;
