'use strict'

const axios = require('axios');

let getWeatherModule = async (request, response) => {
  let {lat, lon} = request.query;
// console.log('+++++++++++',lat, lon);
let url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5&units=I`;
let weatherData = await axios.get(url);
  // console.log('=++++===+++', weatherData.data);
  try {
    // let longitude = weatherData.data.lon;
    // let latitude = weatherData.data.lat;
    // console.log(longitude);
    // let weatherArray = weatherData.data.map(weatherProp => new Forecast(weatherProp));
    let weatherArray = parseWeathers(weatherData.data);
    // console.log(weatherData.data);
    weatherArray.then(weather => {response.status(200).send(weather);})
   
  

    // let city = data.find(city => city.city_name.toLowerCase() === searchquery.toLowerCase());
    // city.data.forEach(day => {
    //   let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`
    //   forecastArray.push(new Forecast(day.valid_date, description));
    // });
    // response.send(forecastArray);
  } catch (e) {
    response.status(400).send("City not found");
  }
};

function parseWeathers(weatherData) {
  try {
    const weatherSummarize = weatherData.data.map(fiveDay => {
      return new Forecast(fiveDay);
    });
    return Promise.resolve(weatherSummarize);
  } catch (error) {
    return Promise.reject(error);
  }
}

class Forecast {
  constructor(weatherProp) {
    this.date = weatherProp.valid_date;
    this.description = `It is ${weatherProp.temp} Farenheit with ${weatherProp.weather.description}`;
    // this.lat = latitude;
    // this.lon = longitude;
  }
}

module.exports = getWeatherModule;
