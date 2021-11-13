import "./App.css";
import { useEffect } from "react";
import data from "./data/bechdel-test-all.json";

function App() {
  console.log(data.length);

  useEffect(() => {
    fetch(
      "https://movie-database-imdb-alternative.p.rapidapi.com/?i=tt8858104&r=json&page=1",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key":
            "027cff5cbfmsh439002e33664b4ap1c34c7jsn8622e3b4d4ca",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
