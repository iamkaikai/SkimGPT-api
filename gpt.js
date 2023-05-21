require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const {encode, decode} = require('gpt-3-encoder')   //tokenize the string for length counting
let file = "./input/content.txt"
let paragraphs = [];
const URL = 'https://en.wikipedia.org/wiki/MP3';
// const URL = 'https://www.foxnews.com/politics/nebraska-senator-flips-out-debating-ban-sex-change-surgeries-minors-screams-we-need-trans-people';

//read the input file
// try {
//     data = fs.readFileSync(file, 'utf8');
// } catch (err) {
//     console.error('An error occurred:', err);
// }

//extract html to text
async function fetchURL(){
    let data = '';
    try{
        const response = await axios.get(URL);
        if (response.data) {
            const dom = new jsdom.JSDOM(response.data);
            const document = dom.window.document;
            const paragraphs = document.querySelectorAll('p');
            const h1 = document.querySelectorAll('h1');
            const h2 = document.querySelectorAll('h2');
            
            h1.forEach(h => {
                if (h.textContent) data += "\n\n" + String(h.textContent);
            });
            h2.forEach(h => {
                if (h.textContent) data += "\n\n" + String(h.textContent);
            });
            paragraphs.forEach(p => {
                if (p.textContent) data += "\n\n" + String(p.textContent);
            });
        } else {
            console.log("No data returned from the URL");
        }
    } catch (error) {
        console.log(error);
    }
    return data;
}


//create OpenAI api
const configuration = new Configuration({
    organization: "org-fVyeMZZJOoOtXtwEnS5za3pl",
    apiKey: process.env.OPENAI_API_KEY,
    completionParams: {
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        top_p: 0.8
      }
});
const openai = new OpenAIApi(configuration);

// make request to OpenAI api
const summarize = async (data, num_part) => {
    principle = `   A good summary should be comprehensive, concise, coherent, and independent. These qualities are explained below:
                    A summary must be comprehensive: You should isolate all the important points in the original passage and note them down in a list. Review all the ideas on your list, and include in your summary all the ones that are indispensable to the author's development of her/his thesis or main idea.
                    A summary must be concise: Eliminate repetitions in your list, even if the author restates the same points. Your summary should be considerably shorter than the source. You are hoping to create an overview; therefore, you need not include every repetition of a point or every supporting detail.
                    A summary must be coherent: It should make sense as a piece of writing in its own right; it should not merely be taken directly from your list of notes or sound like a disjointed collection of points.
                    A summary must be independent: You are not being asked to imitate the author of the text you are writing about. On the contrary, you are expected to maintain your own voice throughout the summary. Don't simply quote the author; instead use your own words to express your understanding of what you have read. After all, your summary is based on your interpretation of the writer's points or ideas. However, you should be careful not to create any misrepresentation or distortion by introducing comments or criticisms of your own.`
    history = []
    for(let i = 0; i < num_part; i++){
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant" },
                { role: "user", content: "conclude the material while preserving as many particulars and information as feasible." },
                { role: "assistant", content: "Sure, please provdie the content" },
                { role: "user", content: data[i]}
            ]
        });
        history.push("part " + i + "\n" +response.data['choices'][0]['message']['content']+ "\n")
        console.log(encode(data[i]).length + "->" + encode(history[i]).length );
    }
    console.log('---------------')
    console.log(encode(String(history)).length)
    console.log('---------------')
    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant that summarizes information." },
            { role: "user", content: "please provide a good summarize for the content I give you" },
            { role: "assistant", content: "How do you define a good summary?" },
            { role: "user", content: principle},
            { role: "assistant", content: "Understand, what format do you expect?" },
            { role: "user", content: "Construct a two-part summary: initially, create an overview in a paragraph of 50-100 words; subsequently, delineate the details in numerous bullet points, which may be quite extensive. Also, exclude the 'part %d' " },
            { role: "assistant", content: "Sure, please provdie the content" },
            { role: "user", content: String(history)}
        ]
    })
    return result.data['choices'][0]['message']['content'];
};

async function main(){
    let content = await fetchURL();
    
    const token_len = encode(content).length

    if ( token_len <= 4096){
        console.log("Size fit!! length = " + token_len + "/4096");
        console.log("Summarizing...")
        paragraphs.push(content)
        try {
            let num_part = 1
            let result = await summarize(paragraphs, num_part);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
        
    }else{
        console.log("Size too long! length = " + token_len + "/4096");
        console.log("Breaking content into small parts...")
        let points = []
        let num_part = Math.floor(token_len/4096)+1;    
        let char_len = Math.round(content.length/num_part);
        for(let i =0; i < num_part+1; i++){
            points.push(i*char_len);
        }
        for(let i = 0; i < num_part; i++){
            paragraphs.push(content.substring(points[i], points[i+1]));
        }
        let result = await summarize(paragraphs, num_part);
        console.log(result);
    }
}

main();
