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
    summarizer.save();
    return summarizer;
  } catch (error) {
    throw new Error(`create summarizer error: ${error}`);
  }
}

export async function getSummarizer(url) {
  try {
    console.log('inside get summarizer');
    const sum = await SummarizerModel.findOne({ 'general.url': url }).exec();
    return sum;
  } catch (error) {
    throw new Error(`get summarizer error: ${error}`);
  }
}
