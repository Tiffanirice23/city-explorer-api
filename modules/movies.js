'use strict'

const axios = require('axios');

let getMoviesModule = async (request, response, next) => {
  try {
    let city = request.query.cityName;
    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${city}`;
    console.log(movieURL);
    let movieData = await axios.get(movieURL);
    let movieMap = parseMovies(movieData.data.results);
    movieMap.then(movie => {
      response.status(200).send(movie);
    })
  
  } catch (e) {
    response.status(400).send("Movie in your City not found");
  }
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


  module.exports = getMoviesModule;
