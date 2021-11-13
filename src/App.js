import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("https://imdb8.p.rapidapi.com/auto-complete?q=twilight", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": "027cff5cbfmsh439002e33664b4ap1c34c7jsn8622e3b4d4ca",
      },
    })
      .then((response) => {
        console.log(response.body);
      })
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
