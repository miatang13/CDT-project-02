import Director from "../components/Director";
import test_data from "../data/test.json";
import data from "../data/ranked-directors(2&above).json";
import { useEffect, useRef } from "react";
import WebGLApp from "../webgl/webgl-app";

export default function Main() {
  // webgl
  const containerRef = useRef(null);
  const webglApp = useRef(null);
  const cssContainerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current === null) return;
    if (webglApp.current !== null) return;
    console.log("Initializing GL with: ", containerRef.current);

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

    return () => {
      webglApp.current.render(false);
      window.removeEventListener("resize", onWindowResize, false);
    };
  }, []);

  return (
    <div>
      <h1> Display all directors </h1>
      <div id="webgl" ref={containerRef}></div>
      <div id="css" ref={cssContainerRef}></div>
      <div>
        {data.map((directorObj, i) => (
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
