require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const {encode, decode} = require('gpt-3-encoder')   //tokenize the string for length counting
let file = "./input/content.txt"
let data;

//read the input file
try {
    data = fs.readFileSync(file, 'utf8');
} catch (err) {
    console.error('An error occurred:', err);
}

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

const response = async () => {
    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that summarizes text and provides detailed bullet points for each section. First, provide a 50–100-word summary of the text, then provide multiple concise bullet points covering all the key details in each section."
            },{
                role: "user",
                content: data
            }
           
        ],
    });
    console.log("--------------------")
    console.log(result.data['choices'][0]['message']['content']);
    // console.log(result);     // full detail of the result
    console.log("--------------------")
};

const token_len = encode(data).length
if ( token_len <= 4096){
    console.log("fit!! length = " + token_len);
    console.log("loading...")
    response().catch(console.error);
}else{
    console.log("too long! length = " + token_len);
}

