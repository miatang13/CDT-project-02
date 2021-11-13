import { useEffect, useRef, useState } from "react";
import data from "./data/bechdel-test-selected.json";

function App() {
  const btnRef = useRef();
  const [downloadHref, setDownloadHref] = useState();
  const [dataJson, setData] = useState([{ hi: "okay" }]);

  const outputJson = () => {
    //https://stackoverflow.com/questions/65903776/how-to-read-and-write-to-local-json-files-from-react-js
    const TextFile = () => {
      const textFile = new Blob([[JSON.stringify(dataJson)]], {
        type: "application/json",
      }); //pass data from localStorage API to blob
      setDownloadHref(URL.createObjectURL(textFile));
      btnRef.current.download = "data.json";
    };

    TextFile();
  };

  useEffect(() => {
    console.log(data.length);
  }, []);

  const fetchData = (imdbid) => {
    let fetchLink =
      "https://movie-database-imdb-alternative.p.rapidapi.com/?i=tt" +
      imdbid +
      "&r=json&page=1";
    fetch(fetchLink, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
        "x-rapidapi-key": "027cff5cbfmsh439002e33664b4ap1c34c7jsn8622e3b4d4ca",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let orig = dataJson;
        orig.push(data);
        setData(orig);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchAllData = () => {
    fetchData("0199753");
  };

  /*
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
  */

  return (
    <div className="App">
      <header className="App-header"></header>
      <a ref={btnRef} href={downloadHref} onClick={outputJson}>
        {" "}
        Download file{" "}
      </a>
      <button onClick={fetchAllData}> fetch data</button>
    </div>
  );
}

export default App;
