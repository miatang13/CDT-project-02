import Director from "../components/Director";
import test_data from "../data/test-ranked.json";
import data from "../data/ranked-directors(>2).json";
import { useEffect, useRef, useState } from "react";
import WebGLApp from "../webgl/webgl-app";
import "../styles/main.css";
import "../styles/director.css";
import complete_data from "../data/ranked-directors(>2).json";

export default function Main() {
  const max_index = complete_data.length - 1;
  let currentDirectorIdx = 0;
  const [currentDirectorObj, setDirectorObj] = useState(
    complete_data[currentDirectorIdx]
  );

  // testing
  const displayDataJsx = false;

  // webgl
  const containerRef = useRef(null);
  const webglApp = useRef(null);
  const cssContainerRef = useRef(null);

  function updateDirector(e) {
    let new_index;
    if (e.key === "ArrowDown") {
      new_index = Math.min(currentDirectorIdx + 1, max_index);
    } else {
      new_index = Math.max(currentDirectorIdx - 1, 0);
    }
    currentDirectorIdx = new_index;
    setDirectorObj(complete_data[currentDirectorIdx]);
  }

  useEffect(() => {
    if (containerRef.current === null) return;
    if (webglApp.current !== null) return;

    function onWindowResize() {
      webglApp.current.handleResize();
    }

    webglApp.current = new WebGLApp(
      containerRef.current,
      cssContainerRef.current
    );
    webglApp.current.setup();
    webglApp.current.render(true);
    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("keydown", updateDirector, false);

    return () => {
      webglApp.current.render(false);
      window.removeEventListener("resize", onWindowResize, false);
      window.removeEventListener("keydown", updateDirector, false);
    };
  }, []);

  return (
    <div>
      <h1> Display all directors </h1>
      <div id="webgl" ref={containerRef}></div>
      <div id="over_gl">
        <div id="posters">
          {currentDirectorObj.movies.map((movieObj) => {
            return <img src={movieObj.Poster} alt={movieObj.Title}></img>;
          })}
          <img id="posterImg" src="" alt="movie"></img>
        </div>
        <h1 id="director_name"> {currentDirectorObj.name} </h1>
      </div>
      <div id="css" ref={cssContainerRef}></div>
      <div>
        {displayDataJsx &&
          data.map((directorObj, i) => (
            <Director
              director_name={directorObj.name}
              movies={directorObj.movies}
              key={i}
            />
          ))}
      </div>
    </div>
  );
}
