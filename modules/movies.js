'use strict'

const axios = require('axios');
let cache = {

};

let getMovies = async (request, response, next) => {
  try {
    let city = request.query.cityName;
    let lowercaseCity = city.toLowerCase();
    // let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${city}`;
    // console.log(movieURL);
    let key = lowercaseCity + 'Data';
    let timeToCache = 1000 * 60 * 60 * 24 * 30 * 12;

    if (cache[key] && Date.now() - cache[key].timeStamp < timeToCache) {
      console.log('Movies ARE in the cache');
      response.status(200).send(cache[key].data);
    } else {
      console.log('Movies are NOT in the cache. Make a new request!');
      let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${city}`
      let movieData = await axios.get(movieURL);
      let movieMap = parseMovies(movieData.data.results);
      movieMap.then(movie => {
        cache[key] = {
          data: movie,
          timeStamp: Date.now()
        };
        response.status(200).send(movie);
      });
    }
  } catch (e) {
    response.status(400).send("Movie in your City not found");
  };
};

  function parseMovies(moviesData) {
    // console.log("movdiesDATA HERE: ", moviesData);
    try {
      const movieSummarize = moviesData.map(oneMovie => {
        return new Movie(oneMovie);
      });
      return Promise.resolve(movieSummarize);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  class Movie {
    constructor(movieProp) {
      this.title = movieProp.original_title;
      this.overview = movieProp.overview;
      this.image_url = movieProp.poster_path;
      this.release = movieProp.release_date;
      this.popularity = movieProp.popularity;
    }
  }


  module.exports = getMovies;
