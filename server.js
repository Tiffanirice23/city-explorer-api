'use strict'
const axios = require ('axios');

console.log('My first server');

const express = require('express');
// const require = require('express/lib/request');
require ('dotenv').config();

// let data = require('./data/weather.json');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
  response.send ('Hello from my server!');
});

app.get('/weather', async (request, response) => {
  // let {searchquery} = request.query;
  // console.log(request.query);

  let lat = request.query.lat;
  let lon = request.query.lon;

  // let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&unit=I&days=5&lat=${lat}&lon=${lon}`

  let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`

  
  try {
    let weatherData = await axios.get(url);
    let longitude = weatherData.data.lon;
    let latitude = weatherData.data.lat;
    console.log(longitude);
    let weatherArray = weatherData.data.data.map(weatherProp => new Forecast(weatherProp, latitude, longitude));
    response.status(200).send(weatherArray);
    
    /*let city = data.find(city => city.city_name.toLowerCase() === searchquery.toLowerCase());
    city.data.forEach(day => {
      let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`
      forecastArray.push(new Forecast(day.valid_date, description));
    });
    response.send(forecastArray);*/
  } catch(e) {
    response.status(400).send("City not found");
  }
})

let movieURL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIEDB_API_KEY}`;

app.get('/movie', async (request, response) => {
 try {
  let city = request.query.city;

  let movieData = await axios.get(movieURL);
  let responseData = movieData.data.results.filter(movie => movie.overview.includes(city));
  console.log(city);
  let mappedMovie = responseData.map(movieProp => new Movie (movieProp))
  response.status(200).send(mappedMovie);

} catch(e) {
  response.status(400).send("Movie in your City not found");
}
});


class Forecast {
  constructor(weatherProp, latitude, longitude) {
    this.date = weatherProp.valid_date;
    this.description = `It is ${weatherProp.temp} Farenheit with ${weatherProp.weather.description}`;
    this.lat = latitude;
    this.lon = longitude;
  }
}

class Movie {
  constructor(movieProp) {
    this.title = movieProp.original_title;
    this.release = movieProp.release_date;
    this.overview = movieProp.overview;
  }
}

app.get('*', (request, response) =>{
  response.send('On snap! The things you are looking for doesn\'t exist');
})

app.use((error, request, response, next) => {
  response.status(500).send({
    "error": "Something went wrong."
  });
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));
