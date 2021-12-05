import { useEffect, useRef, useState } from "react";
import WebGLApp from "../webgl/webgl-app";
import "../styles/main.css";
import "../styles/director.css";
import complete_data from "../data/main-data.json";
import { initRefArray } from "../webgl/helper/ref";

// redux
import { useDispatch } from "react-redux";
import { add } from "../reducers/cart";
import NavigationBar from "../components/Navbar";

export default function Main() {
  const max_index = complete_data.length - 1;
  var currentDirectorIdx = 0;
  const [currentIdx, setIdx] = useState(0);

  // webgl
  const containerRef = useRef(null);
  const cssContainerRef = useRef(null);
  const webglApp = useRef(null);
  const postersDivRef = useRef(null);
  const posterImgRefs = useRef([]);
  initRefArray(posterImgRefs, 6); // max length
  const directorNameRef = useRef(null);

  // redux
  let cart = useRef([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      cart.current = JSON.parse(localStorage.getItem("cart"));
    } else {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  }, []);

  function updateCart() {
    let orig = JSON.parse(localStorage.getItem("cart"));
    const MAX_DIRECTORS = 5;
    orig.push(complete_data[currentIdx]);
    if (orig.length > MAX_DIRECTORS) {
      alert("You can only select a maximum of 5 directors to compare. :-)");
      return;
    }
    localStorage.setItem("cart", JSON.stringify(orig));
  }

  function handleAddDirector() {
    dispatch(add(currentDirectorIdx));
    updateCart(currentDirectorIdx);
  }

  function getWebglParams() {
    let movieObjs = complete_data[currentDirectorIdx].movies.map((movie) => {
      let first_genre = movie.Genre.substr(0, movie.Genre.indexOf(","));
      return {
        imgLink: movie.Poster,
        genre: first_genre === "" ? movie.Genre : first_genre,
        rated: movie.Rated,
        /* need to add NYT article */
      };
    });
    return movieObjs;
  }

  function handleUpdateState() {
    webglApp.current.updateState(getWebglParams());
  }

  function updateDirector(e) {
    let new_index;
    if (e.key === "ArrowDown") {
      new_index = Math.min(currentDirectorIdx + 1, max_index);
    } else {
      new_index = Math.max(currentDirectorIdx - 1, 0);
    }
    if (new_index === currentDirectorIdx) return;
    currentDirectorIdx = new_index;
    setIdx(new_index);
    handleUpdateState();
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
    webglApp.current.setup(getWebglParams());
    //handleUpdateState();
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
      <div id="webgl" ref={containerRef}></div>
      <div id="css" ref={cssContainerRef}></div>
      <div className="root" ref={directorNameRef}>
        <NavigationBar />
        <div className="center__container min-vh-90">
          <h1 id="director_name">{complete_data[currentIdx].name}</h1>
        </div>
        <div id="footer">
          <button className="btn btn-light" onClick={handleAddDirector}>
            Add director
          </button>
        </div>
      </div>
    </div>
  );
}
