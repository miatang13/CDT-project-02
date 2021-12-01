import Director from "../components/Director";
import test_data from "../data/test-ranked.json";
import data from "../data/ranked-directors(>2).json";
import { useEffect, useRef } from "react";
import WebGLApp from "../webgl/webgl-app";
import "../styles/scroll.css";
import "../styles/director.css";

export default function Main() {
  // testing
  const displayDataJsx = false;

  // webgl
  const containerRef = useRef(null);
  const webglApp = useRef(null);
  const cssContainerRef = useRef(null);
  // scroll
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current === null) return;
    if (webglApp.current !== null) return;

    function onWindowResize() {
      webglApp.current.handleResize();
    }

    webglApp.current = new WebGLApp(
      containerRef.current,
      cssContainerRef.current,
      scrollContainerRef.current
    );
    webglApp.current.setup();
    webglApp.current.render(true);
    window.addEventListener("resize", onWindowResize, false);

    return () => {
      webglApp.current.render(false);
      window.removeEventListener("resize", onWindowResize, false);
    };
  }, []);

  return (
    <div>
      <h1> Display all directors </h1>
      <div id="webgl" ref={containerRef}></div>
      <div id="over_gl">
        <span id="scrollY"> </span>
        <div id="posters">
          <img id="posterImg" src="" alt="movie"></img>
        </div>
        <h1 id="director_name"> Initial </h1>
      </div>
      <div id="css" ref={cssContainerRef}></div>
      <div id="container" ref={scrollContainerRef}></div>
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
