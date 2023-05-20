require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const news = `
US debt ceiling talks hampered by 'serious differences
By Sam Cabral
BBC News, Washington
White House and Republican negotiators have resumed US debt ceiling talks after a brief pause on Friday that rattled financial markets.
House of Representatives Speaker Kevin McCarthy said negotiations at the Capitol were back on, but the White House warned of "serious differences".
Republicans had suspended talks hours earlier, accusing the White House of "unreasonable" requests.
Without a deal, the US could default on its $31.4tn (£25.2tn) debt.
That would mean the government could not borrow any more money or pay all of its bills.
The Treasury Department has warned that a default could begin on 1 June.
Speaker McCarthy told Fox Business on Friday evening: "We'll be back in the room tonight.
"But it's very frustrating if they want to come into the room and think we're going to spend more money next year than we did this year. That's not right, and that's not going to happen."
He said he had not spoken to President Joe Biden, who is attending the G7 summit in Japan and will be back in Washington on Sunday after cutting short his foreign trip.
A really simple guide to the US debt ceiling
Could a US debt default unleash global chaos?
What Danes can teach the US about its debt crisis
Garret Graves, the lead Republican negotiator, told reporters they had had a "candid discussion about realistic numbers, a realistic path forward and something that truly changes the trajectory of this country's spending and debt problem".
The White House suggested the two sides were still some way from an agreement.
Speaking at a news conference in Hiroshima, press secretary Karine Jean-Pierre said: "We have serious differences. And this is going to continue to be a difficult conversation. That's not lost on us."
She also questioned whether congressional Republicans were serious about wanting to cut the deficit and reaching a "reasonable" deal.
An advertising board showing the US national debt standing at $31tn.
Failure to raise the debt ceiling from its current limit could see the US suspend its social insurance payments and the salaries of its federal and military employees. Default also threatens to wreak havoc on the global economy, affecting prices and mortgage rates in other countries.
The pause in the talks earlier on Friday was widely regarded as a negotiating ploy on Capitol Hill, but US financial markets flinched at the development, closing in negative territory that afternoon. The Dow ended down 0.3%, the S&P 500 dipped 0.1% and the Nasdaq slipped 0.2%.
In exchange for support for raising the debt ceiling, Republicans are demanding budget cuts to the tune of $4.5tn, which includes scuppering several of Mr Biden's legislative priorities.
The White House has called the Republican proposal "a blueprint to devastate hard-working American families", although it has indicated in recent days that it may make some budgetary concessions.
Both President Biden and Speaker McCarthy are under pressure from the left and right flanks of their respective parties to hold the line. With a one-seat Democratic majority in the Senate and Republicans in narrow control of the House, a deal has so far proven elusive.
And with the clock ticking, the two parties remain far apart.
Patrick McHenry, a North Carolina Republican who is also involved in the talks, told the Wall Street Journal earlier on Friday that negotiations were at "a very bad moment".
Mr Biden has argued that raising the debt limit and reducing the budget deficit should be two separate issues, but about six in 10 Americans disagree, according to a new Associated Press-NORC poll.
`;


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
            {role: "system", content: "You are a summarizer. provide keynotes for reader"},
            {role: "user",content: news}
        ],
    });
    console.log(result.data['choices'][0]['message']['content']);
};

response().catch(console.error);
