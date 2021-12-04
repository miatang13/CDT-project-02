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

  function handleUpdateState() {
    let imgLinks = complete_data[currentDirectorIdx].movies.map(
      (movie) => movie.Poster
    );
    webglApp.current.updateState(imgLinks);
  }

  function updateDirector(e) {
    console.log("update director");
    let new_index;
    if (e.key === "ArrowDown") {
      new_index = Math.min(currentDirectorIdx + 1, max_index);
    } else {
      new_index = Math.max(currentDirectorIdx - 1, 0);
    }
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
    webglApp.current.setup();
    handleUpdateState();
    webglApp.current.render(true);
    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("keydown", updateDirector, false);

    return () => {
      webglApp.current.render(false);
      window.removeEventListener("resize", onWindowResize, false);
      window.removeEventListener("keydown", updateDirector, false);
    };
  }, []);

  function posterJsx() {
    const MAX_MOVIE = 6;
    let jsx = [];
    let data = complete_data[currentIdx].movies;
    for (let i = 0; i < MAX_MOVIE; i++) {
      if (data[i]) {
        let movieObj = data[i];
        let elem = (
          <div key={movieObj.Title} ref={posterImgRefs.current[i]}>
            <img
              src={movieObj.Poster}
              alt={movieObj.Title}
              className="indiv_poster"
            ></img>
          </div>
        );
        jsx.push(elem);
      } else {
        jsx.push(<div ref={posterImgRefs.current[i]}></div>);
      }
    }
    return jsx;
  }

  return (
    <div>
      <div id="webgl" ref={containerRef}></div>
      <div id="css" ref={cssContainerRef}>
        {/* <div>{posterJsx()}</div> */}
      </div>
      <div className="root" ref={directorNameRef}>
        <NavigationBar />
        <div className="center__container min-vh-90">
          <h1 id="director_name"> {complete_data[currentIdx].name} </h1>
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
