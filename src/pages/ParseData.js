import { useEffect } from "react";
import movie_data from "../data/response(all).json";
import bechdel_data from "../data/bechdel-test-2010-onwards.json";

export default function ParseData() {
  useEffect(() => {
    let directors = {}; // each entry contains {name: ..., movies: [], ratings: 0};
    let actors = {}; // each entry contains {name: ..., movies: []};
    let movies = movie_data;
    for (var i = 0; i < movies.length; i++) {
      let movie = movie_data[i];
      if (!movie.imdbID) {
        continue;
      }
      let queryId = movie["imdbID"].slice(2);
      let bechdel = bechdel_data.find((b) => b.imdbid === queryId);
      if (!bechdel) {
        console.log("Couldn't find bechdel", queryId);
        continue;
      }
      if (bechdel.rating !== 3) {
        continue;
      }
      let director = movie.Director;
      console.log(director);
      if (director === "N/A") {
        continue;
      }
      if (!directors[director]) {
        directors[director] = {
          movieCnt: 0,
          movies: [],
          ratingSum: 0,
          avgRating: 0,
          name: director,
        };
      }
      directors[director].movieCnt += 1;
      directors[director].movies.push(movie);
      directors[director].ratingSum += bechdel.rating; // divide by numMovies for avg rating
    }

    let directorArr = [];

    for (const director in directors) {
      let directorObj = directors[director];
      directorObj.avgRating = directorObj.ratingSum / directorObj.movies.length;
      directorArr.push(directorObj);
    }

    directorArr.sort((dir1, dir2) => {
      let ret = dir1.movieCnt > dir2.movieCnt ? -1 : 1;
      return ret; // all movies with rating of 3
    });

    console.log(directorArr);
    /*
	mainCast = API_call_get_cast(movie);
	for (var j = 0; j < mainCast.length; j ++){ 
		actors[mainCast[j]] += 1;
		actors[mainCast[j]].movies.push(movie);
		// accumulate rating too  */
  }, []);
  return <div> Parse Data</div>;
}
