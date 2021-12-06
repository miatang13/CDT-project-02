import { useEffect, useRef, useState } from "react";
import WebGLApp from "../webgl/webgl-app";
import "../styles/main.css";
import complete_data from "../data/final-data.json";
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
    const MAX_DIRECTORS = 4;
    orig.push(complete_data[currentIdx]);
    if (orig.length > MAX_DIRECTORS) {
      alert("You can only select a maximum of 4 directors to compare. :-)");
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

  const snippetPositions = [
    { marginLeft: "-60vw", marginTop: "-40vh" },
    { marginLeft: "-50vw", marginTop: "30vh" },
    { marginLeft: "50vw", marginTop: "-70vh" },
    { marginLeft: "20vw", marginTop: "-30vh" },
    { marginLeft: "65vw", marginTop: "55vh" },
  ];

  return (
    <div id="main__wrapper">
      <div id="webgl" ref={containerRef}></div>
      <div id="css" ref={cssContainerRef}></div>
      <div className="root" id="vis__text" ref={directorNameRef}>
        <NavigationBar activeKey={1} color="white" />
        <div className="min-vh-90">
          <div className="center__container min-vh-90">
            <div className="vline" id="y__axis">
              <span>Latest Release</span>
            </div>
            <h1 id="director_name">{complete_data[currentIdx].name}</h1>
            <hr id="x__axis" />
            <span id="x__axis__label"> Box Office (Least to Greatest) </span>
            {complete_data[currentIdx].NYT_articles.map((article, index) => (
              <div
                className="article__snippet"
                style={snippetPositions[index]}
                key={index}
              >
                <p>"{article.snippet} "</p>
                <a
                  className="btn"
                  target="_blank"
                  rel="noreferrer"
                  href={article.web_url}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    className="bi bi-link-45deg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                  </svg>{" "}
                  Read More
                </a>
              </div>
            ))}
          </div>
        </div>

        <div id="footer">
          <button className="btn btn-light" onClick={handleAddDirector}>
            Add director{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-bookmark-plus"
              viewBox="0 0 16 16"
            >
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
              <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
