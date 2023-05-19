'use strict'
require('dotenv').config();
const axios = require('axios');
const getMoviesModule = require('./modules/movies');
const getWeatherModule = require('./modules/weather');

console.log('My first server');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
  response.send('Hello from my server!');
});

// app.get('/weather', async (request, response) => {
  // let {searchquery} = request.query;
  // console.log(request.query);

  app.get('/movies', getMoviesModule);
  app.get('/weather', getWeatherModule);

  // let lat = request.query.lat;
  // let lon = request.query.lon;

  // let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&unit=I&days=5&lat=${lat}&lon=${lon}`

  // let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5&units=I`


  // try {
  //   let weatherData = await axios.get(url);
  //   let longitude = weatherData.data.lon;
  //   let latitude = weatherData.data.lat;
  //   console.log(longitude);
  //   let weatherArray = weatherData.data.data.map(weatherProp => new Forecast(weatherProp, latitude, longitude));
  //   response.status(200).send(weatherArray);

    /*let city = data.find(city => city.city_name.toLowerCase() === searchquery.toLowerCase());
    city.data.forEach(day => {
      let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`
      forecastArray.push(new Forecast(day.valid_date, description));
    });
//     response.send(forecastArray);*/
//   } catch (e) {
//     response.status(400).send("City not found");
//   }
// })

// function parseWeathers(weatherData) {
//   try {
//     const weatherSummarize = weatherData.data.map(fiveDay => {
//       return new Forecast(fiveDay);
//     });
//     return Promise.resolve(weatherSummarize);
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }

// function parseMovies(moviesData) {
//   // console.log("movdiesDATA HERE: ", moviesData);
//   try {
//     const movieSummarize = moviesData.map(oneMovie => {
//       return new Movie(oneMovie);
//     });
//     return Promise.resolve(movieSummarize);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// }

// app.get('/movies', async (request, response, next) => {
//   try {
//     let city = request.query.cityName;
//     let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${city}`;
//     console.log(movieURL);
//     let movieData = await axios.get(movieURL);
//     let movieMap = parseMovies(movieData.data.results);
//     movieMap.then(movie => {
//     response.status(200).send(movie);
//     })

//   } catch (e) {
//     response.status(400).send("Movie in your City not found");
//   }
// });

app.get('*', (request, response) => {
  response.send('On snap! The things you are looking for doesn\'t exist');
})

// class Forecast {
//   constructor(weatherProp, latitude, longitude) {
//     this.date = weatherProp.valid_date;
//     this.description = `It is ${weatherProp.temp} Farenheit with ${weatherProp.weather.description}`;
//     this.lat = latitude;
//     this.lon = longitude;
//   }
// }

// class Movie {
//   constructor(movieProp) {
//     this.title = movieProp.original_title;
//     this.overview = movieProp.overview;
//     this.image_url = movieProp.poster_path;
//     this.release = movieProp.release_date;
//     this.popularity = movieProp.popularity;
//   }
// }


app.use((error, request, response, next) => {
  response.status(500).send({
    "error": "Something went wrong."
  });
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));
