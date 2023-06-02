import SummarizerModel from '../models/summarizer_model';
import gptCall from '../gpt';

export async function createSummarizer(initInfo) {
  try {
    console.log(initInfo.url);
    const existingSum = await SummarizerModel.findOne({ 'general.url': initInfo.url });
    if (existingSum) {
      return existingSum;
    }
    const summarizer = await gptCall(initInfo.url);
    return summarizer;
  } catch (error) {
    throw new Error(`create summarizer error: ${error}`);
  }
}

export async function getSummarizer(url) {
  try {
    const sum = await SummarizerModel.findOne({ 'general.url': url }).exec();
    return sum;
  } catch (error) {
    throw new Error(`get summarizer error: ${error}`);
  }
}

export async function getSection(body) {
  try {
    const { url } = body;
    const { sectionId } = body;

    const sum = await SummarizerModel.findOne({ 'general.url': url });
    const { sections } = sum;
    let section = {};
    console.log('----------');

    for (let i = 0; i < sections.length; i += 1) {
      if (String(sections[i].id) === String(sectionId)) {
        section = sections[i];
        console.log(section);
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
