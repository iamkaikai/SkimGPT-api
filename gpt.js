require('dotenv').config();
const fetchAndParseURL = require('./parser');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const axios = require('axios');
const jsdom = require('jsdom');
const {encode, decode} = require('gpt-3-encoder')   //tokenize the string for length counting
let file = "./input/content.txt"
const path = require('path');
const URL = 'https://www.cs.dartmouth.edu/~albertoq/cs10/notes21.html';
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
   
    for(let i = 0; i < num_part; i++){
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant" },
                { role: "user", content: "conclude the material while preserving as many particulars and information as feasible. the length should be around 80% of the input." },
                { role: "assistant", content: "Sure, please provdie the content" },
                { role: "user", content: " give me a paragraph of overview and a list bullet points for the highlights:\n" + paragraphs[i]}
            ]
        });
        result_temp = response.data['choices'][0]['message']['content'];
        history.push("part " + i + "\n" + result_temp + "\n")
        console.log(encode(paragraphs[i]).length + "->" + encode(history[i]).length );
        console.log("part " + i + "\n" + result_temp + "\n")
    }
    console.log('---------------')
    console.log("Final length: " + encode(String(history)).length)
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

//execute the program, 
//if the input in less than 4096 token just throw the entire content as input
//if its longer than 4096, break it into pieces and fetch them to GPT
async function main(){
    let content = await fetchAndParseURL(URL);
    // const token_len = encode(content).length

    // if ( token_len <= 4096){
    //     console.log("Size fit!! length = " + token_len + "/4096");
    //     console.log("Summarizing...")
    //     paragraphs.push(content)
    //     try {
    //         let num_part = 1
    //         let result = await summarize(paragraphs, num_part);
    //         console.log(result);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }else{
    //     console.log("Size too long! length = " + token_len + "/4096");
    //     console.log("Breaking content into small parts...")
    //     let points = []
    //     let num_part = Math.floor(token_len/4096)+1;    
    //     let char_len = Math.round(content.length/num_part);

    //     for(let i =0; i < num_part+1; i++){
    //         points.push(i*char_len);
    //     }
    //     for(let i = 0; i < num_part; i++){
    //         paragraphs.push(content.substring(points[i], points[i+1]));
    //     }

    //     //feed the paragraphs to the summarizer
    //     let result = await summarize(paragraphs, num_part);
    //     console.log(result);
    // }
}

main();
