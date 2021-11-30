import { useEffect, useRef, useState } from "react";
import movie_data from "../data/not-using/response(all).json";
import bechdel_data from "../data/not-using/bechdel-test-2010-onwards.json";
import directors_data from "../data/ranked-directors(>2).json";

export default function ParseData() {
  const btnRef = useRef();
  const [downloadHref, setDownloadHref] = useState();
  const [directorJson, setDirectorJson] = useState([]);

  const outputJson = () => {
    //https://stackoverflow.com/questions/65903776/how-to-read-and-write-to-local-json-files-from-react-js
    const TextFile = () => {
      const textFile = new Blob([[JSON.stringify(directorJson)]], {
        type: "application/json",
      });
      setDownloadHref(URL.createObjectURL(textFile));
      btnRef.current.download = "data.json";
    };

    TextFile();
  };

  const parseData = () => {
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
      if (directorObj.movies.length > 2) {
        directorArr.push(directorObj);
      }
    }

    directorArr.sort((dir1, dir2) => {
      let ret = dir1.movieCnt > dir2.movieCnt ? -1 : 1;
      return ret; // all movies with rating of 3
    });

    // setDirectorJson(directorArr);

    let missingBoxOffice = [];
    directors_data.forEach((director) => {
      director.movies.forEach((movie) => {
        if (movie.BoxOffice === "N/A") {
          missingBoxOffice.push(movie.Title);
        }
      });
    });

    setDirectorJson(missingBoxOffice);
  };
  return (
    <div>
      <a ref={btnRef} href={downloadHref} onClick={outputJson}>
        Download file
      </a>
      <button onClick={parseData}> Parse Data</button>
    </div>
  );
}
