/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
// import fs from 'fs';
import { encode } from 'gpt-3-encoder';
import { Configuration, OpenAIApi } from 'openai';
import RetoneModel from './models/retone_model';

const fetchAndParseURL = require('./parser');
require('dotenv').config();

let history = [];

// create new retoner model instance
const retoner = new RetoneModel();

// config OpenAI api
const configuration = new Configuration({
  organization: 'org-fVyeMZZJOoOtXtwEnS5za3pl',
  apiKey: process.env.OPENAI_API_KEY,
  completionParams: {
    temperature: 0.5,
    top_p: 0.8,
  },
});
const openai = new OpenAIApi(configuration);

// make request to OpenAI api
const retone = async (title, content, index) => {
  let retries = 5; // try to request three times for each paragraph
  let success = false; // if success, turn success to true

  // summary for each sections
  while (retries > 0 && success !== true) {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant' },
          { role: 'user', content: 'conclude the material while preserving as many particulars and information as feasible.' },
          { role: 'assistant', content: 'Sure, please provide the content' },
          { role: 'user', content: ` the title of the content is:\n${title}\nthe following is one of the paragraphs` },
          { role: 'user', content: ` give me a title, and rewrite the following in a more lighthearted and cheerful manner.:\n${content}.` },
        ],
      });

      // push result to history to keep track of the summary for each paragraph
      const resultTemp = response.data.choices[0].message.content;
      const resultTempLen = await encode(resultTemp).length;
      history.push(`\n${resultTemp}\n`);

      console.log('---------------');
      console.log(`length: ${encode(content).length}->${encode(resultTemp).length}`);
      console.log(`part ${index}\n${resultTemp}\n`);

      // locate title and overview+highlights in resultTemp
      const titleStartIndex = resultTemp.indexOf(':') + 2; // Start after the colon and space
      const titleEndIndex = resultTemp.indexOf('\n', titleStartIndex);
      const sectionTitle = resultTemp.substring(titleStartIndex, titleEndIndex).trim();

      const overviewIndex = resultTemp.indexOf('Overview:');
      const sectionOverview = resultTemp.substring(overviewIndex).trim();

      retoner.sections.push({
        id: index + 1,
        length: resultTempLen,
        title: sectionTitle,
        content,
      });
      retoner.save();

      success = true;
    } catch (error) {
      console.log(`Request failed. Retrying (${retries - 1} attempts left)...`);
      await new Promise((res) => { return setTimeout(res, 2000); }); // Wait 3s before retrying
      retries -= 1;
    }
  }
};

export const main = async (pageUrl) => {
  const [sections, resultHtml] = await fetchAndParseURL(pageUrl);
  const tokenLen = encode(String(sections)).length;

  console.log(`Input length = ${tokenLen}/4096`);
  console.log(`Total paragraphs = ${sections.length - 1}`);

  const numSections = sections.length;
  const title = sections[0];

  retoner.general.title = title;
  retoner.general.num_sections = numSections;
  retoner.general.url = pageUrl;
  retoner.general.result_html = resultHtml;

  retoner.save();

  const resultPromises = sections.slice(1).map((section, index) => {
    return retone(title, section, index);
  });
  await Promise.all(resultPromises);

  history = history.join('\n');
  console.log(history);

  retoner.general.overview = result;

  return retoner;
};

export default main;
