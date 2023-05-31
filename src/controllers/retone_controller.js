import RetoneModel from '../models/retone_model';
import gptCall from '../gpt';

export async function createRetone(initInfo) {
  try {
    console.log(initInfo.url);
    const existingRet = await RetoneModel.findOne({
      'general.url': initInfo.url,
    });
    if (existingRet) {
      return existingRet;
    }
    const retone = await gptCall(initInfo.url); // CHANGE THIS TO NEW RETONE FUNCTION (needs to make clean html and then call gpt)
    retone.save();
    return retone;
  } catch (error) {
    throw new Error(`create retone error: ${error}`);
  }
}

export async function getRetone(url) {
  try {
    console.log('inside get retone');
    const ret = await RetoneModel.findOne({ 'general.url': url }).exec();
    return ret;
  } catch (error) {
    throw new Error(`get retone error: ${error}`);
  }
}
