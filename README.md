# SkimGPT API

SkimGPT is a Chrome extension built to help the users efficiently digest online articles and blog posts. It uses GPT to generate summary of the webpage the user is currently on and displays it on the side.

This repo stores our database for articles that have been summariezed, and the API that allows users to interact with the database, to query for articles, and to generate summaries of new articles. We also clean the text of the articles and produce a clean version of the article for readers to digest more easily.

![screenshot](/img/api_screenshot.png)

## Architecture

Code Organization

* `src/` - all source code
    * `src/server.js` - main entry point for the server
    * `src/routes.js` - all routes
    * `src/models/` - all models
        * `src/models/summarizer_model.js` - summarizer model
    * `src/controllers/` - all controllers
        * `src/controllers/summarizer_controller.js` - summarizer controller
* `package.json` - all dependencies and scripts
* `package-lock.json` - all dependencies and versions
* `Procfile` - for Heroku deployment
* `.eslintrc.json` - eslint configuration
* `.babelrc` - babel configuration
* `.env` - environment variables (OPENAI API key)
* `.gitignore` - gitignore file
* `README.md` - this file
* `img/` - all images

Tools and Libraries Used

* starter express app template (provided by Tim)
    * node with babel
    * expressjs
    * airbnb eslint rules
* Node
* React
* Axios
* APIs used
    * OpenAI GPT-3 API
    * Readability API
* Database
    * MongoDB
    * Mongoose

## Setup

`npm install` to install dependencies, and that's it!
To run locally, run `npm start` and go to `localhost:9090`.

## Deployment

Deployed on render.com and MongoDB.

Procfile for Heroku included
Settings for render.com:
* build command:  `npm install && npm run build`
* run command:  `npm run prod`

Render setup and MongoDB set up following [SA6 Kahoot API](https://brunchlabs.notion.site/SA6-Kahoot-API-f9e5bbc269654c918a14b0860ab510b7).

## Authors

* Kyle Huang
* Annie Tang
* Pedro Campos
* Gyuri Hwang
* Ashley Liang
* Di Luo

## Acknowledgments

Big thanks to Tim's starter express app template and previous labs/projects, the TAs Camden Hao and Zhoucai Ni for their help! Also shoutout to chatGPT for helping us figure out how to structure some code.
