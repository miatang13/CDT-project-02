import { useEffect, useRef, useState } from "react";
import movie_data from "../data/not-using/response(all).json";
import bechdel_data from "../data/not-using/bechdel-test-2010-onwards.json";
import directors_data from "../data/ranked-directors(>2).json";
// merge
import final_directors from "../data/main-data.json";
import NYT_data from "../data/NYT-articles.json";

export default function ParseData() {
  const btnRef = useRef();
  const [downloadHref, setDownloadHref] = useState();
  const [outputJson, setOutputJson] = useState([]);

  const compileOutput = () => {
    //https://stackoverflow.com/questions/65903776/how-to-read-and-write-to-local-json-files-from-react-js
    const TextFile = () => {
      const textFile = new Blob([[JSON.stringify(outputJson)]], {
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

    // setOutputJson(directorArr);

    let missingBoxOffice = [];
    directors_data.forEach((director) => {
      director.movies.forEach((movie) => {
        if (movie.BoxOffice === "N/A") {
          missingBoxOffice.push(movie.Title);
        }
      });
    });

    setOutputJson(missingBoxOffice);
  };

  function mergeData() {
    console.log(NYT_data.length, final_directors.length);
    let finalData = [];

    for (let i = 0; i < final_directors.length; i++) {
      let dirObj = final_directors[i];
      let NYT_articles = NYT_data.find((el) => el.name === dirObj.name);
      if (!NYT_articles) {
        console.log("could not find article for ", dirObj.name);
        continue;
      }
      let new_obj = dirObj;
      new_obj.NYT_articles = NYT_articles.stories;
      finalData.push(new_obj);
    }

    console.log(finalData);
    setOutputJson(finalData);
  }

  return (
    <div>
      <a ref={btnRef} href={downloadHref} onClick={compileOutput}>
        Download file
      </a>
      <button onClick={parseData}> Parse Data</button>
      <button onClick={mergeData}> Merge Data</button>
    </div>
  );
}
