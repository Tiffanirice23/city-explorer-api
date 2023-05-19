'use strict';

const axios = require('axios');
let cache = require('./cache.js');


let getWeather = async(request, response) => {
  let {lat, lon} = request.query;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5&units=I`;
  try {
    const key = 'weather-' + lat + lon;
    let timeToCache = 1000 * 60 * 60 * 24;

    if (cache[key] && (Date.now() - cache[key].timestamp < timeToCache)) {
      console.log(`Weather IS in the cache`);
    } else {
      console.log('Weather is NOT in the cache. Make a new request!');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = await axios.get(url)
        .then(response => parseWeather(response.data));
    }

    response.status(200).send(cache[key].data);
  } catch (e) {
    response.status(400).send("Weather not found");
  }
};


function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Forecast(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Forecast {
  constructor(weatherProp) {
    this.date = weatherProp.valid_date;
    this.description = `${weatherProp.temp} Farenheit with ${weatherProp.weather.description}`;
    // this.lat = latitude;
    // this.lon = longitude;
  }
}

module.exports = getWeather;
