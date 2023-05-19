'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const getMovies = require('./modules/movies.js');
const getWeather = require('./modules/weather.js');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('Hello from my server!');
});


app.get('/movies', (request, response) => getMovies(request, response));
app.get('/weather', (request, response) => getWeather(request, response));

// function weatherHandler(request, response) {
//   const { lat, lon } = request.query;
//   weather(lat, lon)
//   .then(summaries => response.send(summaries))
//   .catch((error) => {
//     console.error(error);
//     response.status(200).send('Sorry. Something went wrong!')
//   });
// }  

app.use((error, request, response, next) => {
  response.status(500).send({
    "error": "Something went wrong."
  });
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
