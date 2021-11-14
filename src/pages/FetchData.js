import { useEffect, useRef, useState } from "react";
import data from "../data/bechdel-test-2010-onwards.json";
import response_data from "../data/response(all).json";
//import data from "./data/bechdel-test-test.json";

export default function FetchData() {
  const btnRef = useRef();
  const [downloadHref, setDownloadHref] = useState();
  const [dataJson, setData] = useState([]);
  const [sortedDataJson, setSorted] = useState([]);

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
    // have done 0 - 200
    const startIdx = 501;
    const endIdx = Math.min(1500, data.length);
    for (let i = startIdx; i < endIdx; i++) {
      fetchData(data[i].imdbid);
    }
  };

  const fetchSingleData = () => {
    const i = 199;
    console.log(data[i]);
    //fetchData(data[i].imdbid);
  };

  const sortData = () => {
    for (const response in response_data) {
      const query = response_data[response].Title;
      let f = data.find((d) => (d.title = query));
      // console.log(query, f);
      if (!f) {
        console.log("Can't find title", query);
      }
    }
  };

  return (
    <div className="FetchDataPage">
      <a ref={btnRef} href={downloadHref} onClick={outputJson}>
        Download file
      </a>
      <button onClick={fetchData}> fetch data</button>
      <button onClick={fetchSingleData}> fetch single data</button>
      <button onClick={sortData}> check data</button>
    </div>
  );
}
