const axios = require('axios');
// const fs = require('fs');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

async function fetchAndParseURL(URL) {
  let resultHTML = '';
  let sections = [];

  try {
    const response = await axios.get(URL);
    if (response.data) {
      const dom = new JSDOM(response.data);
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      const resultTitle = `<title>${article.title}</title>`;
      let resultText = `${resultTitle}\n${article.textContent}`;
      resultHTML = `${resultTitle}\n${article.content}`;

      // if the html has "h" tag, go to resultText and append the tag
      let lineCounter = 0;
      let targetLine = 0;
      const resultHTMLLines = (resultHTML.split('\n'));
      const resultTextLines = (resultText.split('\n'));
      let i = 1;
      const sectionAnchors = [];
      let anchor = '';

      resultHTMLLines.forEach((element) => {
        const regex = /(<h1|<h2|<h3|<h4)([^>]*)>(.*?)<\/h[1-4]>/;
        const match = element.match(regex);

        if (match) {
          const keyword = match[3];
          targetLine = lineCounter;
          const regexTxt = new RegExp(`\\b${keyword}\\b`, 'g');
          anchor = `<a href="#reader-view${i}">${keyword}</a>`;
          resultTextLines[targetLine] = resultTextLines[targetLine].replace(regexTxt, `\n----\n\n\n<section id=section${i}>${anchor}</section>\n`);
          sectionAnchors.push(element);
          i += 1;
        } else {
          resultTextLines[targetLine] += '\n----\n';
        }
        lineCounter += 1;
      });

      let newResultHTML = '';
      let j = 1;

      resultHTMLLines.forEach((element) => {
        if (sectionAnchors.includes(element)) {
          const regex = /(<h1|<h2|<h3|<h4)([^>]*)>(.*?)<\/(h[1-4])>/;
          const match = element.match(regex);
          const keyword = match[3];
          anchor = `<a href="#section${j}">${keyword}</a>`;
          newResultHTML += `${element.replace(regex, `$1$2 section id=reader-view${j}>${anchor}</$4>`)}\n`;
          j += 1;
        } else {
          newResultHTML += `${element}\n`;
        }
      });

      resultHTML = newResultHTML;

      resultText = resultTextLines.join('\n');
      // save(resultText, './output/parser.txt');
      // save(resultHTML, './output/parser.html');

      // process the bad format
      sections = resultText.split('----');
      sections.forEach((element) => {
        sections = sections.filter((item) => { return !/^[\n\r\s]*$/.test(item); });
      });
    }
  } catch (error) {
    console.log(error);
  }
  return [sections, resultHTML];
}

// function save(result, outDir) {
//   fs.writeFile(outDir, result, (err) => {
//     if (err) throw err;
//   });
// }

module.exports = fetchAndParseURL;
