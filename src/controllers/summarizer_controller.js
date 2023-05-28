import SummarizerModel from '../models/summarizer_model';
import gptCall from '../gpt';

export async function createSummarizer(initInfo) {
  let summarizer = new SummarizerModel();
  try {
    console.log(initInfo.url);
    summarizer = await gptCall(initInfo.url);
    return summarizer.save();
  } catch (error) {
    throw new Error(`create summarizer error: ${error}`);
  }
}

export async function getSection(id) {
  try {
    const sum = await SummarizerModel.find();
    const { sections } = sum[0];
    let section = {};

    for (let i = 0; i < sections.length; i += 1) {
      if (String(sections[i].id) === String(id)) {
        section = sections[i];
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
