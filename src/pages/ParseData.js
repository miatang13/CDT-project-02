import { useEffect } from "react";
import movie_data from "../data/response(0-200).json";
import bechdel_data from "../data/bechdel-test-2010-onwards.json";

export default function ParseData() {
  useEffect(() => {
    let directors = {}; // each entry contains {name: ..., movies: [], ratings: 0};
    let actors = {}; // each entry contains {name: ..., movies: []};
    let movies = movie_data;
    for (var i = 0; i < movies.length; i++) {
      let movie = movie_data[i];
      let bechdel = bechdel_data[i];
      let director = movie.Director;
      if (!directors[director]) {
        directors[director] = {
          movieCnt: 0,
          movies: [],
          ratingSum: 0,
        };
        console.log(director);
      }
      directors[director].movieCnt += 1;
      directors[director].movies.push(movie);
      directors[director].ratingSum += bechdel.rating; // divide by numMovies for avg rating
    }
    console.log(directors);
    /*
	mainCast = API_call_get_cast(movie);
	for (var j = 0; j < mainCast.length; j ++){ 
		actors[mainCast[j]] += 1;
		actors[mainCast[j]].movies.push(movie);
		// accumulate rating too  */
  }, []);
  return <div> Parse Data</div>;
}
