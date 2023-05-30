import socketio from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRoutes from './router';
import * as Summaries from './controllers/summarizer_controller';

// initialize
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*', // allows requests all incoming connections
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// additional init stuff should go before hitting the routing
app.use('/api', apiRoutes);

// default index route
app.get('/', (req, res) => {
  res.send('hello! this is skimgpt\'s api');
});

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    // connect DB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/skimgpt_api';
    await mongoose.connect(mongoURI);
    console.log(`Mongoose connected to: ${mongoURI}`);

    const port = process.env.PORT || 9090;
    server.listen(port);

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();

// socket.io stuff
io.on('connection', (socket) => {
  // on first connection say hi to client
  socket.emit('hello', 'hey client');

  // initial call to create summary based on url and send back to client
  socket.on('createSummary', (fields) => {
    Summaries.createSummarizer(fields).then((result) => {
      socket.emit('summary', result);
    }).catch((error) => {
      console.log(error);
      socket.emit('error', 'create failed');
    });
  });
});
