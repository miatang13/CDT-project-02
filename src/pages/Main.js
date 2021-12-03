import Director from "../components/Director";
import test_data from "../data/test-ranked.json";
import data from "../data/ranked-directors(>2).json";
import { useEffect, useRef, useState } from "react";
import WebGLApp from "../webgl/webgl-app";
import "../styles/main.css";
import "../styles/director.css";
import complete_data from "../data/ranked-directors(>2).json";
import { initRefArray } from "../webgl/helper/ref";

export default function Main() {
  const max_index = complete_data.length - 1;
  let currentDirectorIdx = 0;
  const [currentDirectorObj, setDirectorObj] = useState(
    complete_data[currentDirectorIdx]
  );

  // webgl
  const containerRef = useRef(null);
  const cssContainerRef = useRef(null);
  const webglApp = useRef(null);
  const postersDivRef = useRef(null);
  const posterImgRefs = useRef([]);
  initRefArray(posterImgRefs, 6); // max length
  const directorNameRef = useRef(null);

  function updateDirector(e) {
    let new_index;
    if (e.key === "ArrowDown") {
      new_index = Math.min(currentDirectorIdx + 1, max_index);
    } else {
      new_index = Math.max(currentDirectorIdx - 1, 0);
    }
    currentDirectorIdx = new_index;
    setDirectorObj(complete_data[currentDirectorIdx]);
    webglApp.current.updateState(
      complete_data[currentDirectorIdx].movies.length
    );
  }

  useEffect(() => {
    if (containerRef.current === null) return;
    if (webglApp.current !== null) return;

    function onWindowResize() {
      webglApp.current.handleResize();
    }

    webglApp.current = new WebGLApp(
      containerRef.current,
      cssContainerRef.current,
      postersDivRef.current,
      posterImgRefs.current,
      directorNameRef.current
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
      <div id="css" ref={cssContainerRef}>
        <div>
          {currentDirectorObj.movies.map((movieObj, index) => (
            <div ref={posterImgRefs.current[index]}>
              <img
                src={movieObj.Poster}
                alt={movieObj.Title}
                className="indiv_poster"
              ></img>
            </div>
          ))}
        </div>
      </div>
      <div class="root center__container" ref={directorNameRef}>
        <h1 id="director_name"> {currentDirectorObj.name} </h1>
      </div>
    </div>
  );
}
