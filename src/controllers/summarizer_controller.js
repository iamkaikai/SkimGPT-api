import SummarizerModel from '../models/summarizer_model';
import gptCall from '../gpt';

export async function createSummarizer(initInfo) {
  try {
    let foundSum = await SummarizerModel.find({ general: { url: initInfo.url } });
    if (foundSum.length > 0) {
      return foundSum;
    }

    foundSum = await gptCall(initInfo.url);
    return foundSum.save();
  } catch (error) {
    throw new Error(`create summarizer error: ${error}`);
  }
}

export async function getSummarizer(initInfo) {
  try {
    const sum = await SummarizerModel.find({ general: { url: initInfo.url } });
    if (sum.length > 0) {
      return sum;
    } else {
      throw new Error('summarizer not found');
    }
  } catch (error) {
    throw new Error(`get summarizer error: ${error}`);
  }
}

export async function getSection(id) {
  try {
    const sum = await SummarizerModel.find();
    const { sections } = sum[0];
    let section = {};

    for (let i = 0; i < sections.length; i += 1) {
      if (String(sections[i].id) === String(id + 1)) {
        section = sections[i + 1];
        break;
      }
    }
    return section;
  } catch (error) {
    throw new Error(`get section error: ${error}`);
  }
}

export async function getOverview() {
  try {
    const sum = await SummarizerModel.find();
    const { overview } = sum[1].general;
    return overview;
  } catch (error) {
    throw new Error(`get overview error: ${error}`);
  }
}
