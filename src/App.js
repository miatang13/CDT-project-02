import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch(
      "https://twinword-text-classification.p.rapidapi.com/classify/?text=Hihihih",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "twinword-text-classification.p.rapidapi.com",
          "x-rapidapi-key":
            "027cff5cbfmsh439002e33664b4ap1c34c7jsn8622e3b4d4ca",
        },
      }
    )
      .then((response) => {
        console.log(response);
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
