import RetoneModel from '../models/retone_model';
import retoneCall from '../retone';

export async function createRetone(initInfo) {
  try {
    console.log(initInfo.url);
    console.log(initInfo.tone);
    const existingRet = await RetoneModel.findOne({
      'general.url': initInfo.url,
      'general.tone': initInfo.tone,
    });
    if (existingRet) {
      return existingRet;
    }
    const retone = await retoneCall(initInfo.url, initInfo.tone);
    retone.save();
    return retone;
  } catch (error) {
    throw new Error(`create retone error: ${error}`);
  }
}

export async function getRetone(url, tone) {
  try {
    console.log('inside get retone');
    const ret = await RetoneModel.findOne({
      'general.url': url,
      'general.tone': tone,
    }).exec();
    return ret;
  } catch (error) {
    throw new Error(`get retone error: ${error}`);
  }
}
