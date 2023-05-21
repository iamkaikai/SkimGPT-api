const axios = require('axios');
const fs = require('fs');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

async function fetchAndParseURL(URL) {
    try {
        const response = await axios.get(URL);
        if (response.data) {
            const dom = new JSDOM(response.data);
            const reader = new Readability(dom.window.document);
            const article = reader.parse();
            result = article.textContent;
            save(result);
            return result
        }
    } catch (error) {
        console.log(error);
    }
}

function save(result){
    fs.writeFile('./input/parser.html', result, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

module.exports = fetchAndParseURL;
