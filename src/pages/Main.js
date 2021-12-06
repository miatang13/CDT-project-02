import { useEffect, useRef, useState } from "react";
import WebGLApp from "../webgl/webgl-app";
import "../styles/main.css";
import complete_data from "../data/final-data.json";

// redux
import { useDispatch } from "react-redux";
import { add } from "../reducers/cart";
import NavigationBar from "../components/Navbar";
import { snippetPositions } from "../utility/snippetPositions";

export default function Main() {
  const max_index = complete_data.length - 1;
  var directorIdx = 0; // actual reference to number
  if (localStorage.getItem("directorIdx")) {
    directorIdx = JSON.parse(localStorage.getItem("directorIdx"));
  }

  const [currentIdx, setIdx] = useState(directorIdx); // used to trigger re-render

  // webgl
  const containerRef = useRef(null);
  const cssContainerRef = useRef(null);
  const webglApp = useRef(null);
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
    orig.push(complete_data[directorIdx]);
    if (orig.length > MAX_DIRECTORS) {
      alert("You can only select a maximum of 4 directors to compare. :-)");
      return;
    }
    localStorage.setItem("cart", JSON.stringify(orig));
  }

  function handleAddDirector() {
    dispatch(add(directorIdx));
    updateCart(directorIdx);
  }

  function getWebglParams(new_index) {
    console.log("New index in getwebglparams:", new_index);
    let movieObjs = complete_data[new_index].movies.map((movie) => {
      let first_genre = movie.Genre.substr(0, movie.Genre.indexOf(","));
      return {
        imgLink: movie.Poster,
        genre: first_genre === "" ? movie.Genre : first_genre,
        rated: movie.Rated,
        year: movie.Year,
        boxOffice: movie.BoxOffice,
        boxOfficeInt: movie.BoxOfficeInt,
        name: movie.Title,
      };
    });
    return movieObjs;
  }

  function handleUpdateState(new_index) {
    localStorage.setItem("directorIdx", new_index);
    webglApp.current.updateState(getWebglParams(new_index));
  }

  function updateDirector(e) {
    let new_index;
    console.log("currentidx", directorIdx);
    if (e.key === "ArrowDown") {
      new_index = Math.min(directorIdx + 1, max_index);
    } else if (e.key === "ArrowUp") {
      new_index = Math.max(directorIdx - 1, 0);
    } else {
      return;
    }
    if (new_index === directorIdx) return;
    directorIdx = new_index;
    setIdx(new_index);
    handleUpdateState(new_index);
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
      directorNameRef.current
    );
    webglApp.current.setup(getWebglParams(currentIdx));
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

  // toggle NYT articles
  const [showNYT, setShowNYT] = useState(false);

  function handleToggleNYT() {
    let orig = showNYT;
    setShowNYT(!orig);
  }

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

            {showNYT &&
              complete_data[currentIdx].NYT_articles.map((article, index) => (
                <div
                  className="article__snippet"
                  style={snippetPositions[index]}
                  key={index}
                >
                  <p>{article.snippet}</p>
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
          <div>
            <button className="btn btn-light" onClick={handleAddDirector}>
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
              </svg>{" "}
              Add director{" "}
            </button>
          </div>
          <div>
            <button className="btn btn-light" onClick={handleToggleNYT}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                className="bi bi-eye"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>{" "}
              Toggle Articles
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
