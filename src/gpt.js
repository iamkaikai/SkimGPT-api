/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
// import fs from 'fs';
import { encode } from 'gpt-3-encoder';
import { Configuration, OpenAIApi } from 'openai';
import SummarizerModel from './models/summarizer_model';

const fetchAndParseURL = require('./parser');
require('dotenv').config();

let history = [];

// create new summarizer model instance
const summarizer = new SummarizerModel();

const principle = `   A good summary should be comprehensive, concise, coherent, and independent. These qualities are explained below:
                A summary must be comprehensive: You should isolate all the important points in the original passage and note them down in a list. Review all the ideas on your list, and include in your summary all the ones that are indispensable to the author's development of her/his thesis or main idea.
                A summary must be concise: Eliminate repetitions in your list, even if the author restates the same points. Your summary should be considerably shorter than the source. You are hoping to create an overview; therefore, you need not include every repetition of a point or every supporting detail.
                A summary must be coherent: It should make sense as a piece of writing in its own right; it should not merely be taken directly from your list of notes or sound like a disjointed collection of points.
                A summary must be independent: You are not being asked to imitate the author of the text you are writing about. On the contrary, you are expected to maintain your own voice throughout the summary. Don't simply quote the author; instead use your own words to express your understanding of what you have read. After all, your summary is based on your interpretation of the writer's points or ideas. 
`;

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
const summarize = async (title, content, index) => {
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
          { role: 'assistant', content: 'Sure, please provdie the content' },
          { role: 'user', content: ` the title of the content is:\n${title}\nthe following is one of the paragraphs` },
          { role: 'user', content: ` give me a title, a short overview and a list bullet points for the highlights:\n${content}. if the content is less than 50 words, just provide a paragraph` },
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

      summarizer.sections.push({
        id: index + 1,
        length: resultTempLen,
        title: sectionTitle,
        overview: sectionOverview,
        content,
      });

      success = true;
    } catch (error) {
      console.log(`Request failed. Retrying (${retries - 1} attempts left)...`);
      await new Promise((res) => { return setTimeout(res, 2000); }); // Wait 2s before retrying
      retries -= 1;
    }
  }
};

const finalSum = async (content) => {
  let retries = 3; // try to request three times for each paragraph
  let success = false; // if success, turn success to true
  const len = await encode(content).length;
  let gptModel;

  console.log('---------------');
  console.log(`Final length: ${len}`);
  console.log('---------------');

  // eslint-disable-next-line no-unused-expressions
  (len <= 4096) ? (gptModel = 'gpt-3.5-turbo') : (gptModel = 'gpt-4');
  console.log(`using ${gptModel}...`);

  while (retries > 0 && success !== true) {
    // final summary
    try {
      const response = await openai.createChatCompletion({
        model: gptModel,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes information.' },
          { role: 'user', content: 'please provide a good summarize for the content I give you' },
          { role: 'assistant', content: 'How do you define a good summary?' },
          { role: 'user', content: principle },
          { role: 'assistant', content: 'Understand, what format do you expect?' },
          { role: 'user', content: 'summary the input and make it easy to read.' },
          { role: 'assistant', content: 'Sure, please provide the content' },
          { role: 'user', content: String(content) },
        ],
      });
      console.log('---------------');
      console.log(response.data.choices[0].message.content);
      success = true;
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log(`Request failed. Retrying (${retries - 1} attempts left)...`);
      console.log(error);
      await new Promise((res) => { return setTimeout(res, 2000); }); // Wait 2s before retrying
      retries -= 1;
    }
  }
  return 'cannot summarize content';
};

export const main = async (pageUrl) => {
  const [sections, resultHtml] = await fetchAndParseURL(pageUrl);
  const tokenLen = encode(String(sections)).length;

  console.log(`Input length = ${tokenLen}/4096`);
  console.log(`Total paragraphs = ${sections.length - 1}`);

  const numSections = sections.length;
  const title = sections[0];

  summarizer.general.title = title;
  summarizer.general.num_sections = numSections;
  summarizer.general.url = pageUrl;

  const resultPromises = sections.slice(1).map((section, index) => { return summarize(title, section, index); });
  await Promise.all(resultPromises);

  history = history.join('\n');
  console.log(history);
  const result = await finalSum(history);

  summarizer.general.resultHtml = resultHtml;
  summarizer.general.overview = result;

  return summarizer;
};

export default main;
