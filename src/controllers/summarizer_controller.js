import SummarizerModel from '../models/summarizer_model';
import gptCall from '../gpt';

export async function createSummarizer(initInfo) {
  try {
    console.log('inside create summarizer');
    let foundSum = await SummarizerModel.findOne({ 'general.url': initInfo.url }).exec();
    if (foundSum) {
      return foundSum;
    }
    const gptData = await gptCall(initInfo.url);
    foundSum = new SummarizerModel(gptData);
    await foundSum.save();
    return foundSum;
  } catch (error) {
    throw new Error(`create summarizer error: ${error}`);
  }
}

export async function getSummarizer(initInfo) {
  try {
    console.log('inside get summarizer');
    const sum = await SummarizerModel.findOne({ general: { url: initInfo.url } }).exec();
    console.log(sum);
    return sum;
  } catch (error) {
    // throw new Error(`get summarizer error: ${error}`);
    return (`"Error details: ", ${error}`);
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
