require('dotenv').config();
const fetchAndParseURL = require('./parser');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const {encode, decode} = require('gpt-3-encoder')   //tokenize the string for length counting
let file = "./input/content.txt"
const path = require('path');
const URL = 'https://en.wikipedia.org/wiki/mp3';
// const URL = 'https://www.cs.dartmouth.edu/~albertoq/cs10/notes21.html';
// const URL = 'https://www.cnn.com/2023/05/19/politics/biden-japan-visit-china-reaction/index.html';
let paragraphs = [];

//config OpenAI api
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
const summarize = async (paragraphs, num_part) => {
    history = []
    principle = `   A good summary should be comprehensive, concise, coherent, and independent. These qualities are explained below:
                    A summary must be comprehensive: You should isolate all the important points in the original passage and note them down in a list. Review all the ideas on your list, and include in your summary all the ones that are indispensable to the author's development of her/his thesis or main idea.
                    A summary must be concise: Eliminate repetitions in your list, even if the author restates the same points. Your summary should be considerably shorter than the source. You are hoping to create an overview; therefore, you need not include every repetition of a point or every supporting detail.
                    A summary must be coherent: It should make sense as a piece of writing in its own right; it should not merely be taken directly from your list of notes or sound like a disjointed collection of points.
                    A summary must be independent: You are not being asked to imitate the author of the text you are writing about. On the contrary, you are expected to maintain your own voice throughout the summary. Don't simply quote the author; instead use your own words to express your understanding of what you have read. After all, your summary is based on your interpretation of the writer's points or ideas. However, you should be careful not to create any misrepresentation or distortion by introducing comments or criticisms of your own.`
    
                    //summary for each sections
    for(let i = 1; i < num_part; i++){
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant" },
                { role: "user", content: "conclude the material while preserving as many particulars and information as feasible." },
                { role: "assistant", content: "Sure, please provdie the content" },
                { role: "user", content: " the title of the content is:\n" + paragraphs[0] + "\nthe following is one of the paragraphs"},
                { role: "user", content: " give me a paragraph of overview and a list bullet points for the highlights:\n" + paragraphs[i] + ". if the content is short, keep it short"}
            ]
        });
        result_temp = response.data['choices'][0]['message']['content'];
        history.push("----" + i + "\n" + result_temp + "\n");
        console.log('---------------');
        console.log(encode(paragraphs[i]).length + "->" + encode(history[i-1]).length );
        console.log("part " + i + "\n" + result_temp + "\n");
    }
    console.log('---------------')
    console.log("Final length: " + encode(String(history)).length)
    console.log('---------------')
    
    //final summary
    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant that summarizes information." },
            { role: "user", content: "please provide a good summarize for the content I give you" },
            { role: "assistant", content: "How do you define a good summary?" },
            { role: "user", content: principle},
            { role: "assistant", content: "Understand, what format do you expect?" },
            { role: "user", content: "Construct a concise summary" },
            { role: "assistant", content: "Sure, please provdie the content" },
            { role: "user", content: String(history)}
        ]
    })
    return result.data['choices'][0]['message']['content'];
};

async function main(){
    let sections = await fetchAndParseURL(URL);
    const token_len = encode(String(sections)).length

    console.log("Input length = " + token_len + "/4096");
    console.log("Total paragraphs = " + sections.length);
    console.log("Breaking content into small parts...")

    let result = await summarize(sections, sections.length);
    console.log(result);
}

main();
