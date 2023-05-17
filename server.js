'use strict'

console.log('My first server');

const express = require('express');
// const require = require('express/lib/request');
require ('dotenv').config();

let data = require('./data/weather.json');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
  response.send ('Hello from my server!');
});

app.get('/weather', (request, response) => {
  let {searchquery} = request.query;
  try {
    let forecastArray = [];
    let city = data.find(city => city.city_name.toLowerCase() === searchquery.toLowerCase());
    city.data.forEach(day => {
      let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`
      forecastArray.push(new Forecast(day.valid_date, description));
    });
    response.send(forecastArray);
  } catch(e) {
    response.status(400).send("City not found");
  }
})


app.get('*', (request, response) =>{
  response.send('On snap! The things you are looking for doesn\'t exist');
})

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

app.use((error, request, response, next) => {
  response.status(500).send({
    "error": "Something went wrong."
  });
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));
