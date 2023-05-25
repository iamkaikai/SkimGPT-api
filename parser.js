const axios = require('axios');
const fs = require('fs');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

async function fetchAndParseURL(URL) {
    let result_html = '';

    try {
        const response = await axios.get(URL);
        if (response.data) {
            const dom = new JSDOM(response.data);
            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            let result_title = "<title>" + article.title + "</title>";
            result_text = result_title + "\n" + article.textContent;
            result_html = result_title + "\n" + article.content;

            //if the html has "h" tag, go to result_text and append the tag
            let line_counter = 0;
            let target_line = 0;
            let result_html_lines = (result_html.split('\n'));
            let result_text_lines = (result_text.split('\n'));
            let i = 1;

            result_html_lines.forEach(element => {
                let regex = /(<h1|<h2|<h3|<h4)([^>]*)>(.*?)<\/h[1-4]>/;
                let match = element.match(regex);
                
                if (match) {
                    keyword = match[3];
                    target_line = line_counter;
                    regex_txt = new RegExp('\\b' + keyword + '\\b', 'g');
                    result_text_lines[target_line] = result_text_lines[target_line].replace(regex_txt, '\n----\n\n\n' + '<section id=section' + i + '>' + keyword + '</section>\n');
                    i++;
                }else{
                    result_text_lines[target_line] += '\n----\n';
                }                
                line_counter ++;
            });

            result_text = result_text_lines.join("\n");
            save(result_text, './output/parser.txt');
            save(result_html, './output/parser.html');

            //process the bad format
            sections = result_text.split('----');
            sections.forEach(element => {
                sections = sections.filter(item => !/^[\n\r\s]*$/.test(item));
            })
        }

    } catch (error) {
        console.log(error);
    }
    return sections;
}

function save(result,out_dir){
    fs.writeFile(out_dir, result, (err) => {
        if (err) throw err;
    });
}

module.exports = fetchAndParseURL;
