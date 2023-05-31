import { Router } from 'express';
import * as Summarizer from './controllers/summarizer_controller';
import * as Retone from './controllers/retone_controller';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ message: 'welcome to our skimgpt api!' });
});

// summarizer route
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
    const initInfo = req.query;
    const encodedURL = initInfo.url;
    const decodedURL = decodeURIComponent(encodedURL);
    console.log(decodedURL);
    try {
      const result = await Summarizer.getSummarizer(decodedURL);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

// retoning route
router.route('/retones')
  .post(async (req, res) => {
    const initInfo = req.body;
    try {
      Retone.createRetone(initInfo);
      return res.json(`get ${initInfo.url} with tone ${initInfo.tone}`);
    } catch (error) {
      return res.status(403).json({ error });
    }
  })
  .get(async (req, res) => {
    const initInfo = req.query;
    const encodedURL = initInfo.url;
    const decodedURL = decodeURIComponent(encodedURL);
    console.log(decodedURL);

    const { tone } = initInfo;
    try {
      const result = await Retone.getRetone(decodedURL, tone);
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

export default router;
