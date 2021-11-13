import { useEffect, useRef, useState } from "react";
import data from "./data/bechdel-test-2010-onwards.json";
//import data from "./data/bechdel-test-test.json";

function App() {
  const btnRef = useRef();
  const [downloadHref, setDownloadHref] = useState();
  const [dataJson, setData] = useState([]);

  const outputJson = () => {
    //https://stackoverflow.com/questions/65903776/how-to-read-and-write-to-local-json-files-from-react-js
    const TextFile = () => {
      const textFile = new Blob([[JSON.stringify(dataJson)]], {
        type: "application/json",
      });
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
    const startIdx = 0;
    const endIdx = Math.min(200, data.length);
    for (let i = startIdx; i < endIdx; i++) {
      fetchData(data[i].imdbid);
    }
  };

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
